import express from "express";
import { getRandomRecipe, getRecipeById, saveRecipe, checkRecipeSaved, getSavedRecipes, getSavedRecipeById } from "../controllers/recipeController.js";
import { requireAuth } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/random", getRandomRecipe);
router.get("/:id", getRecipeById);
router.get("/saved/:externalId", requireAuth, checkRecipeSaved);
router.post("/api", requireAuth, saveRecipe);
router.get("/", requireAuth, getSavedRecipes);
router.get("/saved-recipe/:id", requireAuth, getSavedRecipeById);

router.get("/:id", getRecipeById);


export default router;