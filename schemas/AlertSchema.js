import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  condition: { type: String, enum: ["ABOVE", "BELOW"], required: true },
  price: { type: Number, required: true },
  triggered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default alertSchema;
