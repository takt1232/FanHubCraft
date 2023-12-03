import express from "express";
import { AdminLogin, login } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);

router.post("/admin/login", AdminLogin);

export default router;
