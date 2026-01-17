import express from "express";
import {
  pauseSimulation,
  resumeSimulation,
  setSimulationSpeed,
  getSimulationStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/pause", pauseSimulation);
router.post("/resume", resumeSimulation);
router.post("/speed", setSimulationSpeed);
router.get("/status", getSimulationStatus);

export default router;
