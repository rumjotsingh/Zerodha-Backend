import express from "express";
import { backtestStrategy } from "../controllers/backtestingController.js";

const router = express.Router();

router.post("/", backtestStrategy);

export default router;
