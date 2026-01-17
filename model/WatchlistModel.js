import mongoose from "mongoose";
import watchlistSchema from "../schemas/WatchlistSchema.js";

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

export default Watchlist;
