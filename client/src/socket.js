import { io } from "socket.io-client";
import { API_BASE_URL } from "./config/api";

// Extract the base URL without the /api part for socket connection
const SOCKET_URL = API_BASE_URL.replace('/api', '');

let socket;

const connectSocket = () => {
  socket = io(SOCKET_URL);
  return socket;
};

const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  return socket;
};

export { connectSocket, getSocket };