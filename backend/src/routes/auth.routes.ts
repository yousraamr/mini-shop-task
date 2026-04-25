import { FastifyInstance } from "fastify";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";
import { appError } from "../utils/error";
import { authGuard } from "../middleware/auth";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (req, reply) => {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.enum(["customer", "admin"]).optional(),
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return reply
        .code(400)
        .send(appError(400, "Bad Request", parsed.error.issues[0].message));
    }

    const { name, email, password, role = "customer" } = parsed.data;

    const { data: authData, error: signUpError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (signUpError || !authData.user) {
      return reply
        .code(400)
        .send(appError(400, "Register Error", signUpError?.message || "Failed"));
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      name,
      email,
      role,
    });

    if (profileError) {
      return reply
        .code(400)
        .send(appError(400, "Profile Error", profileError.message));
    }

    return reply.code(201).send({
      message: "User registered successfully",
      user: {
        id: authData.user.id,
        name,
        email,
        role,
      },
    });
  });

  app.post("/auth/login", async (req, reply) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return reply
        .code(400)
        .send(appError(400, "Bad Request", parsed.error.issues[0].message));
    }

    const { email, password } = parsed.data;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return reply
        .code(401)
        .send(appError(401, "Unauthorized", "Invalid email or password"));
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      return reply
        .code(404)
        .send(appError(404, "Not Found", "Profile not found"));
    }

    const token = jwt.sign(
      {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return reply.send({
      token,
      user: profile,
    });
  });

  app.post("/auth/forgot-password", async (req, reply) => {
    const schema = z.object({
      email: z.string().email(),
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return reply
        .code(400)
        .send(appError(400, "Bad Request", parsed.error.issues[0].message));
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      parsed.data.email
    );

    if (error) {
      return reply
        .code(400)
        .send(appError(400, "Reset Error", error.message));
    }

    return reply.send({
      message: "Password reset email sent",
    });
  });

  app.get("/auth/me", { preHandler: authGuard }, async (req, reply) => {
    return reply.send({
      user: req.user,
    });
  });
}