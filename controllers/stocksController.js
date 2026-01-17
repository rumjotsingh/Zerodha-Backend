import Stock from "../model/StockModel.js";
import AppError from "../utils/AppError.js";

export const getStocks = async (req, res, next) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    next(new AppError("Failed to fetch stocks", 500));
  }
};

export const getStockBySymbol = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const stock = await Stock.findOne({ symbol });
    if (!stock) {
      return next(new AppError("Stock not found", 404));
    }
    res.json(stock);
  } catch (error) {
    next(new AppError("Failed to fetch stock", 500));
  }
};

export const simulateStock = async (req, res, next) => {
  try {
    const { symbol, name, initialPrice } = req.body;
    const stock = new Stock({
      symbol,
      name,
      price: initialPrice,
      open: initialPrice,
      high: initialPrice,
      low: initialPrice,
      volume: 0,
    });
    await stock.save();
    res.status(201).json(stock);
  } catch (error) {
    if (error.code === 11000) {
      next(new AppError("Stock symbol already exists", 400));
    } else {
      next(new AppError("Failed to create stock", 500));
    }
  }
};
