import Post from "../models/Post.js";
import User from "../models/User.js";
import Review from "../models/Review.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath, tags } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newPost = new Post({
      userId,
      description,
      picturePath,
      comments: [],
      tags: JSON.parse(tags || "[]"), // Parse tags from JSON string (default to empty array)
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    console.log(post);
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const { _id } = req.params;
    const post = await Post.findById(_id);
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { description, picturePath, tags } = req.body;

    const updatedFields = {};
    if (description) updatedFields.description = description;
    if (picturePath) updatedFields.picturePath = picturePath;
    if (tags) {
      try {
        updatedFields.tags = JSON.parse(tags);
      } catch (err) {
        return res.status(400).json({ message: "Invalid tags format" });
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* READ reviews for a specific post */
export const getReviewsForPost = async (req, res) => {
  const postId = req.params.postId;

  try {
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reviews = await Review.find({ postId });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* CREATE a new review */
export const createReview = async (req, res) => {
  const { userId, rating, comment, postId } = req.body;

  try {
    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the post exists
    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if already reviewed for the specific post
    const isReviewed = await Review.findOne({ userId: userId, postId: postId });

    if (isReviewed) {
      return res.status(400).json({ message: "Already reviewed this post" });
    }

    const newReview = new Review({
      userId,
      rating,
      comment,
      postId,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const updatedFields = {};
    if (rating) updatedFields.rating = rating;
    if (comment) updatedFields.comment = comment;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedReview) {
      res.status(404).json({ message: "Review Not Found" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      res.status(404).json({ message: "Review Not Found" });
    }

    res.status(200).json({ message: "Delete Successful" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const checkUserReview = async (req, res) => {
  try {
    const { userId, postId } = req.params;
    const review = Review.findOne({ postId: postId });

    if (!review) {
      res.status(404).json({ message: "Post Not Found" });
    } else {
      if (review.userId === userId) {
        res.status(200).json(review);
      } else {
        res.status(200).json({ message: "Use Haven't Reviewed This Post Yet" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addCommentToPost = async (req, res) => {
  try {
    const { postId } = req.params; // Assuming postId is passed in the request params
    const { userId, commentText } = req.body; // Extract userId and commentText from request body

    // Check if the postId, userId, and commentText are present
    if (!postId || !userId || !commentText) {
      return res
        .status(400)
        .json({ message: "Missing postId, userId, or commentText" });
    }

    // Find the post by postId
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add the new comment to the comments array
    post.comments.push({ userId, commentText });

    // Save the updated post with the new comment
    const updatedPost = await post.save();

    res
      .status(200)
      .json({ message: "Comment added successfully", post: updatedPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding comment", error: error.message });
  }
};

export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
