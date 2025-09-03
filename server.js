// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // allow frontend requests
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
  });

  socket.on("updateCanvas", (data) => {
    const { roomId, ...update } = data;
    socket.to(roomId).emit("updateCanvas", update);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Socket.IO server running on port 4000");
});
