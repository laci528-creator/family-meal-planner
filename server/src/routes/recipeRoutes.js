import express from "express";
import { getRandomRecipe, getRecipeById } from "../controllers/recipeController.js";

const router = express.Router();

router.get("/random", getRandomRecipe);
router.get("/:id", getRecipeById);

export default router;