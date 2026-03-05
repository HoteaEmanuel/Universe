import http from "http";
import express from "express";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});
const usersSocket = {};
export function getReceiverSocketId(userId) {
  return usersSocket[userId];
}
io.on("connection", (socket) => {
  console.log("A user connected " + socket.id);
  const userId = socket.handshake.query.userId;
  
  if (userId) {
    usersSocket[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(usersSocket));
  socket.on("disconnect", () => {
    console.log("A user disconnected " + socket.id);
    if (userId) delete usersSocket[userId];
    io.emit("getOnlineUsers", Object.keys(usersSocket));
  });
});
export { io, app, server };
