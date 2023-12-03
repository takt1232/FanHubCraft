import express from "express";
import {
  banUser,
  getBannedUsers,
  getUser,
  getUsers,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/", verifyToken, getUsers);
router.get("/banned/user", verifyToken, getBannedUsers);

router.post("/ban", verifyToken, banUser);

export default router;
