import Watchlist from "../model/WatchlistModel.js";

export const addToWatchlist = async (req, res) => {
  try {
    const { symbol } = req.body;
    const userId = req.user.userId;
    let watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) {
      watchlist = new Watchlist({ userId, symbols: [] });
    }
    if (!watchlist.symbols.includes(symbol)) {
      watchlist.symbols.push(symbol);
      await watchlist.save();
    }
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) {
      return res.json({ symbols: [] });
    }
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const { symbol } = req.params;
    const userId = req.user.userId;
    const watchlist = await Watchlist.findOne({ userId });
    if (watchlist) {
      watchlist.symbols = watchlist.symbols.filter((s) => s !== symbol);
      await watchlist.save();
    }
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
