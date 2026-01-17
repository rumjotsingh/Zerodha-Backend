import Stock from "../model/StockModel.js";
import Trade from "../model/TradeModel.js";

// Simple backtesting: Buy when price crosses SMA, sell when below
export const runBacktest = async (
  symbol,
  strategy,
  startDate,
  endDate,
  initialBalance = 100000,
) => {
  const stock = await Stock.findOne({ symbol });
  if (!stock) throw new Error("Stock not found");

  // For simulation, generate historical prices (simplified)
  const prices = [];
  let price = stock.price;
  for (let i = 0; i < 100; i++) {
    // 100 days
    price += (Math.random() - 0.5) * 10;
    prices.push(price);
  }

  let balance = initialBalance;
  let holdings = 0;
  const trades = [];

  if (strategy === "SMA_CROSS") {
    const smaPeriod = 20;
    for (let i = smaPeriod; i < prices.length; i++) {
      const sma =
        prices.slice(i - smaPeriod, i).reduce((a, b) => a + b, 0) / smaPeriod;
      const prevSma =
        prices.slice(i - smaPeriod - 1, i - 1).reduce((a, b) => a + b, 0) /
        smaPeriod;

      if (prices[i] > sma && prices[i - 1] <= prevSma && balance > prices[i]) {
        // Buy
        const qty = Math.floor(balance / prices[i]);
        balance -= qty * prices[i];
        holdings += qty;
        trades.push({
          side: "BUY",
          price: prices[i],
          quantity: qty,
          timestamp: new Date(),
        });
      } else if (prices[i] < sma && prices[i - 1] >= prevSma && holdings > 0) {
        // Sell
        balance += holdings * prices[i];
        trades.push({
          side: "SELL",
          price: prices[i],
          quantity: holdings,
          timestamp: new Date(),
        });
        holdings = 0;
      }
    }
  }

  const finalValue = balance + holdings * prices[prices.length - 1];
  const pnl = finalValue - initialBalance;

  return { pnl, trades, finalBalance: balance, holdings };
};
