import mongoose from "mongoose";
import tradeSchema from "../schemas/TradesSchema.js";

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;
