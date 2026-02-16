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
// ----- CORS CONFIG -----

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://gidy-profile-phi.vercel.app",
  "https://gidy.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

// Express CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

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

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected");
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.log(err));
