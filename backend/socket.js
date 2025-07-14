import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = new Map();

const getSocketId = (userId) => userSocketMap.get(userId);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("map-user", (userId) => {
    userSocketMap.set(userId, socket.id);
    socket.userId = userId;
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    userSocketMap.delete(socket.userId);
  });
});

export { app, server, io, getSocketId };
