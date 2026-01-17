import express from "express";
import {
  getStocks,
  getStockBySymbol,
  simulateStock,
} from "../controllers/stocksController.js";

const router = express.Router();

router.get("/", getStocks);
router.get("/:symbol", getStockBySymbol);
router.post("/simulate", simulateStock);

export default router;
