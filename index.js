import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import authMiddleware from "./middleware/auth.js";
import simulatePrices from "./simulation/priceSimulation.js";
import {
  globalErrorHandler,
  handleJSONParseError,
} from "./middleware/errorHandler.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import stocksRoutes from "./routes/stocksRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import tradesRoutes from "./routes/tradesRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import backtestingRoutes from "./routes/backtestingRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import alertsRoutes from "./routes/alertsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json({ limit: "10mb" })); // Add limit to prevent large payloads
app.use(handleJSONParseError); // Handle JSON parse errors
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.log("Error connecting to MongoDB:", error));

// WebSocket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join user room for personalized updates
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stocksRoutes);
app.use("/api/orders", authMiddleware, ordersRoutes);
app.use("/api/portfolio", authMiddleware, portfolioRoutes);
app.use("/api/trades", authMiddleware, tradesRoutes);
app.use("/api/watchlist", authMiddleware, watchlistRoutes);
app.use("/api/analytics", authMiddleware, analyticsRoutes);
app.use("/api/backtesting", authMiddleware, backtestingRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/alerts", authMiddleware, alertsRoutes);
app.use("/api/admin", adminRoutes);

// Start price simulation
simulatePrices(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Global error handler (must be last)
app.use(globalErrorHandler);
