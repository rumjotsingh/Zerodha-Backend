import Trade from "../model/TradeModel.js";

export const getTrades = async (req, res) => {
  try {
    const userId = req.user.userId;
    const trades = await Trade.find({ userId });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
