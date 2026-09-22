import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", getCurrentUser);

router.get("/protected-test", requireAuth, (req, res) => {
  res.json({
    error: false,
    message: "Protected route works.",
    user: req.session.user,
  });
});

export default router;
