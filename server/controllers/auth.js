import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import BanUser from "../models/BanUser.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, picturePath, location } =
      req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "Email already exists. Please use a different email." });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      location,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isBanned = await checkIfUserIsBanned(user._id); // Function to check if user is banned
    if (isBanned.banned) {
      return res.status(403).json({
        msg: "Banned",
        reason: isBanned.banReason,
        banEnd: isBanned.banEnd,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to check if the user is banned
const checkIfUserIsBanned = async (userId) => {
  try {
    const bannedUser = await BanUser.findOne({ userId: userId });
    if (bannedUser && bannedUser.banEnd > new Date()) {
      return {
        banned: true,
        banEnd: bannedUser.banEnd,
        banReason: bannedUser.banReason,
      };
    }
    return { banned: false };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const role = user.role;

    if (!user) return res.status(400).json({ msg: "User does not exist." });

    if (user.role === "admin") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password;
      res.status(200).json({ token, user, role });
    } else {
      return res.status(400).json({ msg: "Account Not Admin" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
