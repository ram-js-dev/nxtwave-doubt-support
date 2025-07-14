import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "dotenv";
import { app, server } from "./socket.js";
import authRoutes from "./routes/auth.route.js";
import doubtRoutes from "./routes/doubt.route.js";
import topicRoutes from "./routes/topic.route.js";


config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send({ message: "Hello World!" });
});

app.use(authRoutes);

app.use("/doubts", doubtRoutes);
app.use("/topics", topicRoutes);

app.all(/\/*/, (req, res) => {
  res.status(404).send({ message: "Route doesnot exist" });
});



server.listen(process.env.PORT, async () => {
  const dbConn = await mongoose.connect(process.env.CONNECTION_STRING);
  console.log(dbConn.connection.name);
  console.log(`listenting on URL http://localhost:${process.env.PORT}`);
});
