import express from "express";
import { getTopPerformers } from "../controllers/leaderboardController.js";

const router = express.Router();

router.get("/", getTopPerformers);

export default router;
