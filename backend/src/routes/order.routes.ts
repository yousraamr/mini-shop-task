import { FastifyInstance } from "fastify";
import { z } from "zod";
import { supabase } from "../config/supabase";
import { appError } from "../utils/error";
import { authGuard, adminGuard } from "../middleware/auth";

export async function orderRoutes(app: FastifyInstance) {
  app.post("/orders", { preHandler: authGuard }, async (req, reply) => {
    const schema = z.object({
      items: z
        .array(
          z.object({
            product_id: z.string().uuid("Invalid product id"),
            quantity: z.number().int().positive("Quantity must be positive"),
          })
        )
        .min(1, "Order must contain at least one item"),
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return reply
        .code(400)
        .send(appError(400, "Bad Request", parsed.error.issues[0].message));
    }

    try {
      const productIds = parsed.data.items.map((item) => item.product_id);

      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds)
        .eq("is_active", true);

      if (productsError || !products) {
        return reply
          .code(400)
          .send(appError(400, "Products Error", "Failed to load products"));
      }

      let total = 0;

      const orderItems = parsed.data.items.map((item) => {
        const product = products.find((p) => p.id === item.product_id);

        if (!product) {
          throw new Error("One or more products are invalid or inactive");
        }

        const unitPrice = Number(product.price);
        total += unitPrice * item.quantity;

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: unitPrice,
        };
      });

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: req.user!.id,
          status: "Pending",
          total_amount: total,
        })
        .select()
        .single();

      if (orderError || !order) {
        return reply
          .code(400)
          .send(
            appError(
              400,
              "Order Error",
              orderError?.message || "Failed to place order"
            )
          );
      }

      const itemsToInsert = orderItems.map((item) => ({
        order_id: order.id,
        ...item,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) {
        return reply
          .code(400)
          .send(appError(400, "Order Items Error", itemsError.message));
      }

      return reply.code(201).send({
        message: "Order placed successfully",
        order,
      });
    } catch (error) {
      return reply
        .code(400)
        .send(
          appError(
            400,
            "Order Error",
            error instanceof Error ? error.message : "Failed to place order"
          )
        );
    }
  });

  app.get("/orders/my", { preHandler: authGuard }, async (req, reply) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, products(name, image_url, price))")
      .eq("user_id", req.user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      return reply.code(400).send(appError(400, "Orders Error", error.message));
    }

    return reply.send({ orders: data });
  });

  app.get(
    "/orders",
    { preHandler: [authGuard, adminGuard] },
    async (req, reply) => {
      const querySchema = z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(50).default(10),
      });

      const parsed = querySchema.safeParse(req.query);

      if (!parsed.success) {
        return reply
          .code(400)
          .send(appError(400, "Bad Request", parsed.error.issues[0].message));
      }

      const { page, limit } = parsed.data;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("orders")
        .select(
          "*, profiles(name, email), order_items(*, products(name, image_url, price))",
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        return reply
          .code(400)
          .send(appError(400, "Orders Error", error.message));
      }

      return reply.send({
        orders: data,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      });
    }
  );

  app.patch(
    "/orders/:id/status",
    { preHandler: [authGuard, adminGuard] },
    async (req, reply) => {
      const paramsSchema = z.object({
        id: z.string().uuid("Invalid order id"),
      });

      const bodySchema = z.object({
        status: z.enum(["Pending", "Processing", "Completed", "Cancelled"]),
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

      const { data, error } = await supabase
        .from("orders")
        .update({ status: body.data.status })
        .eq("id", params.data.id)
        .select()
        .single();

      if (error) {
        return reply
          .code(400)
          .send(appError(400, "Update Status Error", error.message));
      }

      return reply.send({ order: data });
    }
  );
}