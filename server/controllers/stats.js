import Post from "../models/Post.js";
import User from "../models/User.js";

// Your controller function to count the number of User entries
export const countUsers = async (req, res) => {
  try {
    // Using Mongoose to perform a count operation on the User model
    const userCount = await User.countDocuments();

    // Sending the count as a response
    res.status(200).json({ userCount });
  } catch (err) {
    // Handling errors
    res
      .status(500)
      .json({ error: "Could not count users", message: err.message });
  }
};

// Your controller function to count the number of Posts entries
export const countPosts = async (req, res) => {
  try {
    // Using Mongoose to perform a count operation on the User model
    const postCount = await Post.countDocuments();

    // Sending the count as a response
    res.status(200).json({ postCount });
  } catch (err) {
    // Handling errors
    res
      .status(500)
      .json({ error: "Could not count users", message: err.message });
  }
};
