import mongoose from "mongoose";
import orderSchema from "../schemas/OrdersSchema.js";

const Order = mongoose.model("Order", orderSchema);

export default Order;
