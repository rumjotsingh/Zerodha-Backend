import express from "express";
import {
  createUserAlert,
  getAlerts,
  removeAlert,
} from "../controllers/alertsController.js";

const router = express.Router();

router.post("/", createUserAlert);
router.get("/", getAlerts);
router.delete("/:alertId", removeAlert);

export default router;
