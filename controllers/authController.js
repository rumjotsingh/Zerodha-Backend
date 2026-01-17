import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";
import Portfolio from "../model/PortfolioModel.js";
import AppError from "../utils/AppError.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new AppError("Please provide name, email and password", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists", 400));
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash });
    await user.save();

    // Create portfolio
    const portfolio = new Portfolio({ userId: user._id });
    await portfolio.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (error) {
    next(new AppError("Registration failed", 500));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    next(new AppError("Login failed", 500));
  }
};
