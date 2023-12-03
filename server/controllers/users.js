import bcrypt from "bcrypt";
import User from "../models/User.js";
import BanUser from "../models/BanUser.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (user) {
      const { firstName, lastName, email, picturePath, location } = req.body;

      // Check if the email already exists for another user
      const existingUser = await User.findOne({
        email: email,
        _id: { $ne: id },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ msg: "Email already exists. Please use a different email." });
      }

      // Prepare the updated fields
      const updatedFields = {
        firstName,
        lastName,
        email,
        picturePath,
        location,
      };

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json(updatedUser);
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Ban User
export const banUser = async (req, res) => {
  try {
    const { userId, banStart, banEnd, banReason, banDetails } = req.body;
    const user = await BanUser.findOne({ userId: userId });

    if (user) {
      return res.status(200).json({ message: "User Is Banned" });
    }

    const newBan = new BanUser({
      userId,
      banStart,
      banEnd,
      banReason,
      banDetails,
    });

    const savedBan = await newBan.save();
    res.status(201).json(savedBan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBannedUsers = async (req, res) => {
  try {
    const bannedUsers = await BanUser.find();
    res.status(200).json(bannedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
