import express from "express";
import { placeOrder, getOrders } from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", placeOrder);
router.get("/", getOrders);

export default router;
