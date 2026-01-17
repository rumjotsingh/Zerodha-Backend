import { getLeaderboard } from "../services/leaderboardService.js";

export const getTopPerformers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await getLeaderboard(limit);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
