import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { appError } from "../utils/error";

export type AuthUser = {
  id: string;
  email: string;
  role: "customer" | "admin";
  name: string;
};

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser;
  }
}

export async function authGuard(req: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply
        .code(401)
        .send(appError(401, "Unauthorized", "Missing authorization token"));
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;

    req.user = decoded;
  } catch {
    return reply
      .code(401)
      .send(appError(401, "Unauthorized", "Invalid or expired token"));
  }
}

export async function adminGuard(req: FastifyRequest, reply: FastifyReply) {
  if (req.user?.role !== "admin") {
    return reply
      .code(403)
      .send(appError(403, "Forbidden", "Admin access only"));
  }
}