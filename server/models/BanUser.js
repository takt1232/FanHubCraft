import mongoose from "mongoose";

const BanUserSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    banStart: {
      type: Date, // Using mongoose Date type directly
      required: true,
    },
    banEnd: {
      type: Date, // Storing ban end as a Date
      required: true,
    },
    banReason: String,
    banDetails: String,
  },
  { timestamps: true }
);

const BanUser = mongoose.model("BanUser", BanUserSchema); // Fix the model name
export default BanUser;
