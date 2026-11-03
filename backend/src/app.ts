import express from "express";
import { env } from "./config/env";
import cors from "cors";

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

export default app;
