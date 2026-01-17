import mongoose from "mongoose";
import alertSchema from "../schemas/AlertSchema.js";

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
