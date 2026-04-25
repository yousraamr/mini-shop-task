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
            product_id: z.string().uuid(),
            quantity: z.number().int().positive(),
          })
        )
        .min(1),
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return reply
        .code(400)
        .send(appError(400, "Bad Request", parsed.error.issues[0].message));
    }

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
        throw new Error("Invalid product");
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
        total_amount: total,
      })
      .select()
      .single();

    if (orderError || !order) {
      return reply
        .code(400)
        .send(appError(400, "Order Error", orderError?.message || "Failed"));
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
  });

  app.get("/orders/my", { preHandler: authGuard }, async (req, reply) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, products(name, image_url))")
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
    async (_req, reply) => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, profiles(name, email), order_items(*, products(name, image_url))")
        .order("created_at", { ascending: false });

      if (error) {
        return reply
          .code(400)
          .send(appError(400, "Orders Error", error.message));
      }

      return reply.send({ orders: data });
    }
  );

  app.patch(
    "/orders/:id/status",
    { preHandler: [authGuard, adminGuard] },
    async (req, reply) => {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const bodySchema = z.object({
        status: z.enum(["Pending", "Processing", "Completed", "Cancelled"]),
      });

      const params = paramsSchema.safeParse(req.params);
      const body = bodySchema.safeParse(req.body);

      if (!params.success || !body.success) {
        return reply
          .code(400)
          .send(appError(400, "Bad Request", "Invalid order status"));
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