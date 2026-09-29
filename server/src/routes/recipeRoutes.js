import express from "express";
import { getRandomRecipe, getRecipeById, saveRecipe, checkRecipeSaved, getSavedRecipes, getSavedRecipeById, deleteRecipe, searchRecipes, saveFamilyRecipe } from "../controllers/recipeController.js";
import { requireAuth } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/random", getRandomRecipe);
router.get("/search", searchRecipes);
router.get("/:id", getRecipeById);
router.get("/saved/:externalId", requireAuth, checkRecipeSaved);

router.post("/api", requireAuth, saveRecipe);
router.post("/custom", requireAuth, saveFamilyRecipe);

router.get("/", requireAuth, getSavedRecipes);
router.get("/saved-recipe/:id", requireAuth, getSavedRecipeById);

router.delete("/:id", requireAuth, deleteRecipe);



export default router;