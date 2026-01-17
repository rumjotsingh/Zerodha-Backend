import Order from "../model/OrdersSchema.js";
import Trade from "../model/TradeModel.js";
import Portfolio from "../model/PortfolioModel.js";
import User from "../model/UserModel.js";
import Stock from "../model/StockModel.js";
import AppError from "../utils/AppError.js";

const executeOrder = async (order) => {
  const stock = await Stock.findOne({ symbol: order.symbol });
  if (!stock) return;

  const price = order.orderType === "MARKET" ? stock.price : order.price;
  const trade = new Trade({
    orderId: order._id,
    userId: order.userId,
    symbol: order.symbol,
    side: order.side,
    price,
    quantity: order.quantity,
  });
  await trade.save();

  // Update portfolio
  let portfolio = await Portfolio.findOne({ userId: order.userId });
  if (!portfolio) {
    portfolio = new Portfolio({ userId: order.userId });
  }

  const holding = portfolio.holdings.find((h) => h.symbol === order.symbol);
  if (order.side === "BUY") {
    if (holding) {
      const totalQuantity = holding.quantity + order.quantity;
      const totalCost =
        holding.quantity * holding.avgPrice + order.quantity * price;
      holding.avgPrice = totalCost / totalQuantity;
      holding.quantity = totalQuantity;
    } else {
      portfolio.holdings.push({
        symbol: order.symbol,
        quantity: order.quantity,
        avgPrice: price,
        ltp: stock.price,
        unrealizedPnl: 0,
      });
    }
    // Deduct balance
    const user = await User.findById(order.userId);
    user.balance -= order.quantity * price;
    await user.save();
    portfolio.balance = user.balance;
  } else {
    // SELL
    if (holding && holding.quantity >= order.quantity) {
      const realized = (price - holding.avgPrice) * order.quantity;
      portfolio.realizedPnl += realized;
      holding.quantity -= order.quantity;
      // Add to balance
      const user = await User.findById(order.userId);
      user.balance += order.quantity * price;
      await user.save();
      portfolio.balance = user.balance;
      if (holding.quantity === 0) {
        portfolio.holdings = portfolio.holdings.filter(
          (h) => h.symbol !== order.symbol,
        );
      }
    }
  }

  // Calculate PnL
  portfolio.totalPnl =
    portfolio.holdings.reduce((total, h) => {
      h.unrealizedPnl = (h.ltp - h.avgPrice) * h.quantity;
      return total + h.unrealizedPnl;
    }, 0) + portfolio.realizedPnl;

  await portfolio.save();

  order.status = "EXECUTED";
  order.executedAt = new Date();
  await order.save();
};

export const placeOrder = async (req, res, next) => {
  try {
    const { symbol, side, orderType, price, quantity } = req.body;
    const userId = req.user.userId;

    if (!symbol || !side || !orderType || !price || !quantity) {
      return next(new AppError("Please provide all required fields", 400));
    }

    const user = await User.findById(userId);
    const stock = await Stock.findOne({ symbol });

    if (!stock) {
      return next(new AppError("Stock not found", 404));
    }

    if (
      side === "BUY" &&
      user.balance < quantity * (orderType === "MARKET" ? stock.price : price)
    ) {
      return next(new AppError("Insufficient balance", 400));
    }

    if (side === "SELL") {
      const portfolio = await Portfolio.findOne({ userId });
      const holding = portfolio?.holdings.find((h) => h.symbol === symbol);
      if (!holding || holding.quantity < quantity) {
        return next(new AppError("Insufficient holdings", 400));
      }
    }

    const order = new Order({
      userId,
      symbol,
      side,
      orderType,
      price: orderType === "MARKET" ? stock.price : price,
      quantity,
    });
    await order.save();

    // Execute immediately for simulation
    await executeOrder(order);

    res.status(201).json(order);
  } catch (error) {
    next(new AppError("Failed to place order", 500));
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (error) {
    next(new AppError("Failed to fetch orders", 500));
  }
};
