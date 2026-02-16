import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import profileRoutes from "./routes/profile.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Enable CORS for both express and socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"], // Include both ports that might be used
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // Include both ports that might be used
  credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/profile", profileRoutes);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });

  // Listen for profile updates from clients
  socket.on("profileUpdate", (data) => {
    // Broadcast the updated profile to all connected clients except sender
    socket.broadcast.emit("profileUpdated", data);
  });

  // Listen for skill endorsements
  socket.on("skillEndorsed", (data) => {
    // Broadcast the updated profile to all connected clients except sender
    socket.broadcast.emit("profileUpdated", data);
  });
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected");
  server.listen(5000, () => console.log("Server running on port 5000"));
})
.catch(err => console.log(err));
