import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { handleUploadError } from "../middleware/uploadErrorMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { uploadRecipeImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/recipe-image",
  requireAuth,
  upload.single("image"),
  handleUploadError,
  uploadRecipeImage
);

export default router;