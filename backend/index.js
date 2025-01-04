import express from "express";
import cors from "cors";
import { Server as createServer } from "socket.io";

const app = express();
app.use(cors());

const server = app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

const io = new createServer(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_message", data);
  });
});
