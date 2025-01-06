import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update with your client URL if needed
    methods: ["GET", "POST"],
  },
});

// Handle socket connection
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join group
  socket.on("join_group", (group) => {
    if (group) {
      socket.join(group);
      console.log(`Socket ${socket.id} joined group ${group}`);
    }
  });

  // Handle incoming messages
  socket.on("message", ({ messages, group }) => {
    if (group && messages) {
      const messageData = {
        messages, // The actual text of the message
      };

      console.log(`Message received in group ${group}:`, messageData);

      // Send message to all group members except the sender
      socket.to(group).emit("receive_message", messageData);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Start server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
