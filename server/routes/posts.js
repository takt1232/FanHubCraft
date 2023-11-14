import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
  getPost,
  getReviewsForPost,
  createReview,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:_id", verifyToken, getPost);
router.get("/:userId/posts", verifyToken, getUserPosts);

// GET reviews for a specific post
router.get("/:postId/reviews", verifyToken, getReviewsForPost);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* DELETE */
router.delete("/:id", verifyToken, deletePost);

// POST a new review
router.post("/addReview", verifyToken, createReview);

export default router;
