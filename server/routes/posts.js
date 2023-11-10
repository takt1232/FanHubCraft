import express from "express";
import { getFeedPosts, getUserPosts, likePost, addComment, updatePost, deletePost, getPost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:_id", verifyToken, getPost);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id", verifyToken, updatePost);

/* DELETE */
router.delete("/:id", verifyToken, deletePost);

/* CREATE */
router.post("/:postId/comment", verifyToken, addComment);

export default router;
