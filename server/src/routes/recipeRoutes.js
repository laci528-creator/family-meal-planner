import express from "express";
import { getRandomRecipe, getRecipeById, saveRecipe, checkRecipeSaved } from "../controllers/recipeController.js";
import { requireAuth } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/random", getRandomRecipe);
router.get("/:id", getRecipeById);
router.get("/saved/:externalId", requireAuth, checkRecipeSaved);
router.post("/api", requireAuth, saveRecipe);

router.get("/:id", getRecipeById);



export default router;