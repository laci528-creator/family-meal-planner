import express from "express";

import {
savePlannerData,
} from "../controllers/plannerController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/save",
  requireAuth,
  savePlannerData
);

export default router;