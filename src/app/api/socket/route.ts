import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import type { NextApiRequest } from "next";

type UserSocketMap = { [userId: string]: string }; // Map of userId -> socketId

const userSockets: UserSocketMap = {}; // Store connected users

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    console.log("Setting up WebSocket server...");

    const httpServer: HttpServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket",
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket: Socket) => {
      console.log("New client connected:", socket.id);

      // Store userId and socketId when user joins
      socket.on("register", (userId: string) => {
        userSockets[userId] = socket.id;
        console.log(`User registered: ${userId} -> ${socket.id}`);
      });

      // Send message to a specific user
      socket.on("privateMessage", ({ toUserId, message }) => {
        const recipientSocketId = userSockets[toUserId];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("message", message);
          console.log(`Sent message to ${toUserId}: ${message}`);
        }
      });

      // Remove user from map when they disconnect
      socket.on("disconnect", () => {
        const userId = Object.keys(userSockets).find((key) => userSockets[key] === socket.id);
        if (userId) {
          delete userSockets[userId];
          console.log(`User disconnected: ${userId}`);
        }
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
