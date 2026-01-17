import express from "express";
import {
  getPortfolio,
  getPositions,
} from "../controllers/portfolioController.js";

const router = express.Router();

router.get("/", getPortfolio);
router.get("/positions", getPositions);

export default router;
