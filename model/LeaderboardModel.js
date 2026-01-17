import mongoose from "mongoose";
import leaderboardSchema from "../schemas/LeaderboardSchema.js";

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

export default Leaderboard;
