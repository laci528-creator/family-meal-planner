import express from "express";

import {
  getRandomRecipe,
  getRecipeById,
  saveRecipe,
  checkRecipeSaved,
  getSavedRecipes,
  getSavedRecipeById,
  deleteRecipe,
  searchRecipes,
  saveFamilyRecipe,
  updateRecipe,
} from "../controllers/recipeController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getSavedRecipes);

router.get("/random", getRandomRecipe);

router.get("/search", searchRecipes);

router.get(
  "/saved/:externalId",
  requireAuth,
  checkRecipeSaved
);

router.get(
  "/saved-recipe/:id",
  requireAuth,
  getSavedRecipeById
);


router.post(
  "/api",
  requireAuth,
  saveRecipe
);

router.post(
  "/custom",
  requireAuth,
  saveFamilyRecipe
);

router.put(
  "/:id",
  requireAuth,
  updateRecipe
);

router.delete(
  "/:id",
  requireAuth,
  deleteRecipe
);

// Generic GET route always last
router.get(
  "/:id",
  getRecipeById
);

export default router;