import Portfolio from "../model/PortfolioModel.js";

export const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.userId;
    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPositions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return res.json({ holdings: [] });
    }
    res.json({ holdings: portfolio.holdings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
