import Leaderboard from "../model/LeaderboardModel.js";
import Portfolio from "../model/PortfolioModel.js";

export const updateLeaderboard = async () => {
  const portfolios = await Portfolio.find().sort({ totalPnl: -1 });
  for (let i = 0; i < portfolios.length; i++) {
    await Leaderboard.findOneAndUpdate(
      { userId: portfolios[i].userId },
      { totalPnl: portfolios[i].totalPnl, rank: i + 1, updatedAt: new Date() },
      { upsert: true },
    );
  }
};

export const getLeaderboard = async (limit = 10) => {
  return await Leaderboard.find()
    .sort({ totalPnl: -1 })
    .limit(limit)
    .populate("userId", "name");
};
