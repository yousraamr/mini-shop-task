import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.routes";
import { productRoutes } from "./routes/product.routes";
import { orderRoutes } from "./routes/order.routes";
import { appError } from "./utils/error";

dotenv.config();

const app = Fastify({
  logger: true,
});

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.setErrorHandler((error, req, reply) => {
  req.log.error(error);

  reply.code(500).send(
    appError(
      500,
      "Internal Server Error",
      (error as Error).message || "Something went wrong"
    )
  );
});

app.get("/", async () => {
  return {
    message: "Mini Shop API is running",
  };
});

app.register(authRoutes);
app.register(productRoutes);
app.register(orderRoutes);

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4000;

    await app.listen({
      port,
      host: "0.0.0.0",
    });

    console.log(`Server running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();