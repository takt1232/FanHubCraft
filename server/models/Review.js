import mongoose from "mongoose";

import Post from "./Post.js";
import User from "./User.js";

// Define the schema for the Review model
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the Post model
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // Reference to the Post model
    required: true,
  },
  // You might want to add more fields based on your requirements
  // For example, timestamp, reference to the Post, etc.
});

// Create the Review model
const Review = mongoose.model("Review", reviewSchema);

export default Review;
