import { runBacktest } from "../services/backtestingService.js";

export const backtestStrategy = async (req, res) => {
  try {
    const { symbol, strategy, startDate, endDate, initialBalance } = req.body;
    const result = await runBacktest(
      symbol,
      strategy,
      startDate,
      endDate,
      initialBalance,
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
