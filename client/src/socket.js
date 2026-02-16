import { io } from "socket.io-client";

let socket;

const connectSocket = () => {
  socket = io("http://localhost:5000");
  return socket;
};

const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000");
  }
  return socket;
};

export { connectSocket, getSocket };