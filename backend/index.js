import path from "path";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "dotenv";
import { app, server } from "./socket.js";
import authRoutes from "./routes/auth.route.js";
import doubtRoutes from "./routes/doubt.route.js";
import topicRoutes from "./routes/topic.route.js";

config();

const __dirname = path.resolve();
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

app.use(authRoutes);

app.use("/doubts", doubtRoutes);
app.use("/topics", topicRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(process.env.PORT, async () => {
  const dbConn = await mongoose.connect(process.env.CONNECTION_STRING);

  console.log(`listenting on URL http://localhost:${process.env.PORT}`);
});
