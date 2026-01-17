import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  totalPnl: { type: Number, default: 0 },
  rank: { type: Number },
  updatedAt: { type: Date, default: Date.now },
});

export default leaderboardSchema;
