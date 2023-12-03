import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { countPosts, countUsers } from "../controllers/stats.js";

const router = express.Router();

//Count all documents in User
router.get("/count/user", verifyToken, countUsers);
//Count all documents in Post
router.get("/count/post", verifyToken, countPosts);

export default router;
