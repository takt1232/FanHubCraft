import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  deletePost,
  getPost,
  getReviewsForPost,
  createReview,
  deleteReview,
  updateReview,
  checkUserReview,
  addCommentToPost,
  getCommentsForPost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:_id", verifyToken, getPost);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/review/:userId/:postId", verifyToken, checkUserReview);
router.get("/comments/:postId", verifyToken, getCommentsForPost);

// GET reviews for a specific post
router.get("/:postId/reviews", verifyToken, getReviewsForPost);

/* UPDATE */
router.patch("/updateReview/:reviewId", verifyToken, updateReview);

/* DELETE */
router.delete("/:id", verifyToken, deletePost);
router.delete("/deleteReview/:reviewId", verifyToken, deleteReview);

// POST a new review
router.post("/addReview", verifyToken, createReview);
router.post("/addComment/:postId", verifyToken, addCommentToPost);

export default router;
