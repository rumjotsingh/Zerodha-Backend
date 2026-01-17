import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  side: { type: String, enum: ["BUY", "SELL"], required: true },
  orderType: {
    type: String,
    enum: ["MARKET", "LIMIT", "STOP_LOSS"],
    required: true,
  },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  filledQuantity: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["PENDING", "PARTIAL", "EXECUTED", "CANCELLED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
  executedAt: { type: Date },
});

export default orderSchema;
