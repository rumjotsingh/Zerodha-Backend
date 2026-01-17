import Stock from "../model/StockModel.js";
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
} from "../services/analyticsService.js";

export const getAnalytics = async (req, res) => {
  try {
    const { symbol, type, period } = req.query;
    const stock = await Stock.findOne({ symbol });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    // For demo, use current price history (simplified)
    const prices = [stock.price]; // In real app, fetch historical data

    let result;
    switch (type) {
      case "SMA":
        result = calculateSMA(prices, parseInt(period) || 20);
        break;
      case "EMA":
        result = calculateEMA(prices, parseInt(period) || 20);
        break;
      case "RSI":
        result = calculateRSI(prices, parseInt(period) || 14);
        break;
      default:
        return res.status(400).json({ message: "Invalid analytics type" });
    }

    res.json({ symbol, type, period, value: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
