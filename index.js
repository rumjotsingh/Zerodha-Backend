import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;
const MONGO_URL =
  "mongodb+srv://rumjotsingh12345:4HzmDWqQRPEesSZe@zerodha.6lip7.mongodb.net/";
mongoose.connect(MONGO_URL);
try {
  console.log("Connected to MongoDB");
} catch (error) {
  console.log("Error connecting to MongoDB");
}
app.use("/api/v1/users", userRoutes);

app.listen(PORT, () => {
  console.log("app is started");
});
