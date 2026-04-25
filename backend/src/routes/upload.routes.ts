import { FastifyInstance } from "fastify";
import { supabase } from "../config/supabase";
import { appError } from "../utils/error";
import { authGuard, adminGuard } from "../middleware/auth";

export async function uploadRoutes(app: FastifyInstance) {
  app.post(
    "/uploads/product-image",
    { preHandler: [authGuard, adminGuard] },
    async (req, reply) => {
      const file = await req.file();

      if (!file) {
        return reply
          .code(400)
          .send(appError(400, "Bad Request", "Image file is required"));
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(file.mimetype)) {
        return reply
          .code(400)
          .send(
            appError(
              400,
              "Bad Request",
              "Only JPEG, PNG, and WEBP images are allowed"
            )
          );
      }

      const buffer = await file.toBuffer();

      const maxSize = 5 * 1024 * 1024;

      if (buffer.length > maxSize) {
        return reply
          .code(400)
          .send(appError(400, "Bad Request", "Image size must be less than 5MB"));
      }

      const fileExt = file.filename.split(".").pop() || "jpg";

      const fileName = `products/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        return reply
          .code(400)
          .send(appError(400, "Upload Error", error.message));
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      return reply.send({
        image_url: data.publicUrl,
      });
    }
  );
}