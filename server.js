// server.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" }, // allow cross-origin for dev
});

// shared canvas state
let canvasState = { lines: [], shapes: [], texts: [], images: [] };

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // send current canvas to new user
  socket.emit("updateCanvas", canvasState);

  // receive updates from any user
  socket.on("updateCanvas", (update) => {
    canvasState = { ...canvasState, ...update };
    socket.broadcast.emit("updateCanvas", update);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(4000, () => console.log("Server running on http://localhost:4000"));
