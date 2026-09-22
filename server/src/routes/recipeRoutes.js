import express from "express";
import { getRandomRecipe } from "../controllers/recipeController.js";

const router = express.Router();

router.get("/random", getRandomRecipe);

export default router;