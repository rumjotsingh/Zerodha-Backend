import Stock from "../model/StockModel.js";
import Portfolio from "../model/PortfolioModel.js";
import Watchlist from "../model/WatchlistModel.js";
import { checkAlerts } from "../services/notificationsService.js";
import { updateLeaderboard } from "../services/leaderboardService.js";
import { simulationPaused } from "../controllers/adminController.js";

const simulatePrices = async (io) => {
  setInterval(async () => {
    if (simulationPaused) return;

    try {
      const stocks = await Stock.find();
      for (const stock of stocks) {
        // Simple random price change
        const change = (Math.random() - 0.5) * 0.02; // -1% to +1%
        const newPrice = stock.price * (1 + change);
        stock.price = Math.max(0.01, newPrice); // Prevent negative prices
        stock.high = Math.max(stock.high, stock.price);
        stock.low = Math.min(stock.low, stock.price);
        stock.volume += Math.floor(Math.random() * 1000);
        stock.lastUpdated = new Date();
        await stock.save();

        const changePercent = ((stock.price - stock.open) / stock.open) * 100;

        // Emit price update
        io.emit("price:update", {
          symbol: stock.symbol,
          price: stock.price,
          change: stock.price - stock.open,
          changePercent,
          timestamp: new Date(),
        });

        // Update portfolios
        const portfolios = await Portfolio.find({
          "holdings.symbol": stock.symbol,
        });
        for (const portfolio of portfolios) {
          const holding = portfolio.holdings.find(
            (h) => h.symbol === stock.symbol,
          );
          if (holding) {
            holding.ltp = stock.price;
            holding.unrealizedPnl =
              (holding.ltp - holding.avgPrice) * holding.quantity;
          }
          portfolio.totalPnl =
            portfolio.holdings.reduce(
              (total, h) => total + h.unrealizedPnl,
              0,
            ) + portfolio.realizedPnl;
          await portfolio.save();

          // Emit portfolio update
          io.to(portfolio.userId.toString()).emit("portfolio:update", {
            balance: portfolio.balance,
            totalPnl: portfolio.totalPnl,
            realizedPnl: portfolio.realizedPnl,
          });
        }

        // Update watchlists
        const watchlists = await Watchlist.find({ symbols: stock.symbol });
        for (const watchlist of watchlists) {
          io.to(watchlist.userId.toString()).emit("watchlist:update", {
            symbol: stock.symbol,
            price: stock.price,
            changePercent,
          });
        }
      }

      // Check alerts
      await checkAlerts(io);

      // Update leaderboard every minute
      if (!global.leaderboardCounter) global.leaderboardCounter = 0;
      global.leaderboardCounter++;
      if (global.leaderboardCounter % 60 === 0) {
        await updateLeaderboard();
      }
    } catch (error) {
      console.error("Error in price simulation:", error);
    }
  }, 1000); // Every 1 second
};

export default simulatePrices;
