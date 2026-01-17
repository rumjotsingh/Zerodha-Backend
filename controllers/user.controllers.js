import User from "../model/UserModel.js";
import PositionsModel from "../model/PositionsModel.js";
import HoldingsModel from "../model/HoldingsModel.js";
import OrdersModel from "../model/OrdersSchema.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please Provide" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      let token = crypto.randomBytes(20).toString("hex");

      user.token = token;
      await user.save();
      return res.status(200).json({
        message: "User Login ",
        success: true,
        token: token,
      });
    } else {
      return res.status(401).json({ message: "Invalid Username or password" });
    }
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(202).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,

      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "User Registered",
    });
  } catch (e) {
    res.json({
      success: false,
      message: `Something went wrong ${e}`,
    });
  }
};
const allHoldings = async (req, res) => {
  try {
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (error) {
    res.json({ message: error });
  }
};
const allPositions = async (req, res) => {
  try {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (error) {
    res.json({ message: error });
  }
};
const newOrders = async (req, res) => {
  try {
    let newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });

    newOrder.save();

    res.send("Order saved!");
  } catch (error) {
    res.json({ message: error });
  }
};
const getNewOrders = async (req, res) => {
  try {
    let AllOrders = await OrdersModel.find({});
    return res.json(AllOrders);
  } catch (err) {
    res.json({ message: err });
  }
};
export { login, register, allHoldings, allPositions, newOrders, getNewOrders };
