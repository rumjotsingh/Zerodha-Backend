import { Router } from "express";
import {
  login,
  register,
  allHoldings,
  allPositions,
  newOrders,
  getNewOrders,
} from "../controllers/user.controllers.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/allHoldings").get(allHoldings);
router.route("/allPositions").get(allPositions);
router.route("/newOrder").post(newOrders);
router.route("/getOrder").get(getNewOrders);

export default router;
