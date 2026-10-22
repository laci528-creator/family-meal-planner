import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadRecipeImage } from "../controllers/uploadController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/recipe-image",
  requireAuth,
  upload.single("image"),
  uploadRecipeImage
);

export default router;