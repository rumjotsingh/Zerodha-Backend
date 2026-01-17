import mongoose from "mongoose";
import stockSchema from "../schemas/StocksSchema.js";

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
