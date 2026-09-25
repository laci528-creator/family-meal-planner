import express from "express";
import { getRandomRecipe, getRecipeById, saveRecipe } from "../controllers/recipeController.js";
import { requireAuth } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/random", getRandomRecipe);
router.get("/:id", getRecipeById);
router.post("/api", requireAuth, saveRecipe);

export default router;