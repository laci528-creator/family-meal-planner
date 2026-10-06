import express from "express";

import {
savePlannerData,
getWeeklyPlannerData,
deletePlannerEntry
} from "../controllers/plannerController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",
requireAuth,
getWeeklyPlannerData
);

router.post(
  "/save",
  requireAuth,
  savePlannerData
);

router.delete(
  "/:id",
  requireAuth, 
  deletePlannerEntry
);

export default router;