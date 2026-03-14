import express, { json, NextFunction, Request, Response } from "express";
// import "dotenv/config";
import cors from "cors";
import { connectDB } from "./config/db.js";

import deviceRoutes from "./routes/devices.js";
import {
  AppError,
  handleMongooseErrors,
} from "./errorHandler/genericErrors.js";
const app = express();

//? Middlewares
app.use(cors());
app.use(json());

//? Routes
app.use("/api/devices", deviceRoutes);

//! Error Handler
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const appError = err instanceof AppError ? err : handleMongooseErrors(err);

  res.status(appError.statusCode).json({ message: appError.message });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
});
