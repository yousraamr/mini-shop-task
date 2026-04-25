import { FastifyInstance } from "fastify";
import { z } from "zod";
import { supabase } from "../config/supabase";
import { appError } from "../utils/error";
import { authGuard, adminGuard } from "../middleware/auth";

export async function productRoutes(app: FastifyInstance) {
  app.get("/products", async (req, reply) => {
    const querySchema = z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    includeInactive: z.string().optional(),
  });

    const parsed = querySchema.safeParse(req.query);

    if (!parsed.success) {
      return reply
        .code(400)
        .send(appError(400, "Bad Request", parsed.error.issues[0].message));
    }

    const { search, category } = parsed.data;

    let query = supabase
  .from("products")
  .select("*, categories(name, slug)")
  .order("created_at", { ascending: false });

if (req.query && !(parsed.data as any).includeInactive) {
  query = query.eq("is_active", true);
}

    if (category) {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();

      if (categoryData) {
        query = query.eq("category_id", categoryData.id);
      }
    }

    const { data, error } = await query;

    if (error) {
      return reply.code(400).send(appError(400, "Products Error", error.message));
    }

    return reply.send({ products: data });
  });

  app.get("/products/:id", async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const parsed = paramsSchema.safeParse(req.params);

    if (!parsed.success) {
      return reply
        .code(400)
        .send(appError(400, "Bad Request", parsed.error.issues[0].message));
    }

    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name, slug)")
      .eq("id", parsed.data.id)
      .single();

    if (error || !data) {
      return reply
        .code(404)
        .send(appError(404, "Not Found", "Product not found"));
    }

    return reply.send({ product: data });
  });

  app.get("/categories", async (_req, reply) => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return reply
        .code(400)
        .send(appError(400, "Categories Error", error.message));
    }

    return reply.send({ categories: data });
  });

  app.post(
    "/products",
    { preHandler: [authGuard, adminGuard] },
    async (req, reply) => {
      const schema = z.object({
        name: z.string().min(2),
        description: z.string().optional(),
        price: z.number().positive(),
        image_url: z.string().url().optional(),
        category_id: z.string().uuid(),
      });

      const parsed = schema.safeParse(req.body);

      if (!parsed.success) {
        return reply
          .code(400)
          .send(appError(400, "Bad Request", parsed.error.issues[0].message));
      }

      const { data, error } = await supabase
        .from("products")
        .insert(parsed.data)
        .select()
        .single();

      if (error) {
        return reply
          .code(400)
          .send(appError(400, "Create Product Error", error.message));
      }

      return reply.code(201).send({ product: data });
    }
  );

  app.patch(
    "/products/:id",
    { preHandler: [authGuard, adminGuard] },
    async (req, reply) => {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const bodySchema = z.object({
        name: z.string().min(2).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        image_url: z.string().url().optional(),
        category_id: z.string().uuid().optional(),
        is_active: z.boolean().optional(),
      });

      const params = paramsSchema.safeParse(req.params);
      const body = bodySchema.safeParse(req.body);

      if (!params.success || !body.success) {
        return reply
          .code(400)
          .send(appError(400, "Bad Request", "Invalid product data"));
      }

      const { data, error } = await supabase
        .from("products")
        .update(body.data)
        .eq("id", params.data.id)
        .select()
        .single();

      if (error) {
        return reply
          .code(400)
          .send(appError(400, "Update Product Error", error.message));
      }

      return reply.send({ product: data });
    }
  );

  app.delete(
  "/products/:id",
  { preHandler: [authGuard, adminGuard] },
  async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const parsed = paramsSchema.safeParse(req.params);

    if (!parsed.success) {
      return reply
        .code(400)
        .send(appError(400, "Bad Request", parsed.error.issues[0].message));
    }

    const { data, error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", parsed.data.id)
      .select();

    if (error) {
      return reply
        .code(400)
        .send(appError(400, "Delete Product Error", error.message));
    }

    return reply.send({
      message: "Product deleted successfully",
      product: data?.[0] || null,
    });
  }
);
}