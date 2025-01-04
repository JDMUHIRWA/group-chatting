import { io } from "socket.io-client";

const mysocket = io("http://localhost:4000");

export default mysocket;
