import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  holdings: [
    {
      symbol: { type: String, required: true },
      quantity: { type: Number, required: true },
      avgPrice: { type: Number, required: true },
      ltp: { type: Number, required: true },
      unrealizedPnl: { type: Number, required: true },
    },
  ],
  totalPnl: { type: Number, default: 0 },
  realizedPnl: { type: Number, default: 0 },
  balance: { type: Number, default: 100000 },
});

export default portfolioSchema;
