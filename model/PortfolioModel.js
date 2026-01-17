import mongoose from "mongoose";
import portfolioSchema from "../schemas/PortfolioSchema.js";

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
