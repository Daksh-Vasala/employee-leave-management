import express from "express";
import { env } from "./config/env";
import cors from "cors";
import indexRoutes from "./index.routes";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Hello from employee-leave-management api !",
  });
});

app.use("/api/v1", indexRoutes);

export default app;
