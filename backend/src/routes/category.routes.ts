import { FastifyInstance } from "fastify";
import { supabase } from "../config/supabase";
import { appError } from "../utils/error";

export async function categoryRoutes(app: FastifyInstance) {
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
}