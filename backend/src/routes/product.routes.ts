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
      includeInactive: z.coerce.boolean().optional().default(false),
    });

    const parsed = querySchema.safeParse(req.query);

    if (!parsed.success) {
      return reply
        .code(400)
        .send(appError(400, "Bad Request", parsed.error.issues[0].message));
    }

    const { search, category, includeInactive } = parsed.data;

    let query = supabase
      .from("products")
      .select("*, categories(id, name, slug)")
      .order("created_at", { ascending: false });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (category) {
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();

      if (categoryError || !categoryData) {
        return reply.send({ products: [] });
      }

      query = query.eq("category_id", categoryData.id);
    }

    const { data, error } = await query;

    if (error) {
      return reply
        .code(400)
        .send(appError(400, "Products Error", error.message));
    }

    return reply.send({ products: data });
  });

  app.get("/products/:id", async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid("Invalid product id"),
    });

    const parsed = paramsSchema.safeParse(req.params);

    if (!parsed.success) {
      return reply
        .code(400)
        .send(appError(400, "Bad Request", parsed.error.issues[0].message));
    }

    const { data, error } = await supabase
      .from("products")
      .select("*, categories(id, name, slug)")
      .eq("id", parsed.data.id)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return reply
        .code(404)
        .send(appError(404, "Not Found", "Product not found"));
    }

    return reply.send({ product: data });
  });

  app.post(
    "/products",
    { preHandler: [authGuard, adminGuard] },
    async (req, reply) => {
      const bodySchema = z.object({
        name: z.string().min(2, "Product name must be at least 2 characters"),
        description: z.string().min(5, "Description is too short"),
        price: z.number().positive("Price must be positive"),
        image_url: z.string().url("Invalid image URL"),
        category_id: z.string().uuid("Invalid category id"),
      });

      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return reply
          .code(400)
          .send(appError(400, "Bad Request", parsed.error.issues[0].message));
      }

      const { data, error } = await supabase
        .from("products")
        .insert({
          ...parsed.data,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        return reply
          .code(400)
          .send(appError(400, "Create Product Error", error.message));
      }

      return reply.code(201).send({
        message: "Product created successfully",
        product: data,
      });
    }
  );

  app.patch(
    "/products/:id",
    { preHandler: [authGuard, adminGuard] },
    async (req, reply) => {
      const paramsSchema = z.object({
        id: z.string().uuid("Invalid product id"),
      });

      const bodySchema = z.object({
        name: z.string().min(2).optional(),
        description: z.string().min(5).optional(),
        price: z.number().positive().optional(),
        image_url: z.string().url().optional(),
        category_id: z.string().uuid().optional(),
        is_active: z.boolean().optional(),
      });

      const params = paramsSchema.safeParse(req.params);
      const body = bodySchema.safeParse(req.body);

      if (!params.success) {
        return reply
          .code(400)
          .send(appError(400, "Bad Request", params.error.issues[0].message));
      }

      if (!body.success) {
        return reply
          .code(400)
          .send(appError(400, "Bad Request", body.error.issues[0].message));
      }

      if (Object.keys(body.data).length === 0) {
        return reply
          .code(400)
          .send(appError(400, "Bad Request", "No fields provided for update"));
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

      return reply.send({
        message: "Product updated successfully",
        product: data,
      });
    }
  );

  app.delete(
    "/products/:id",
    { preHandler: [authGuard, adminGuard] },
    async (req, reply) => {
      const paramsSchema = z.object({
        id: z.string().uuid("Invalid product id"),
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
        .select()
        .single();

      if (error) {
        return reply
          .code(400)
          .send(appError(400, "Delete Product Error", error.message));
      }

      return reply.send({
        message: "Product deleted successfully",
        product: data,
      });
    }
  );
}