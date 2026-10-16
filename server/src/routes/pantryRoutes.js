import express from 'express';
import {
  getPantryList,
  addItemForPantry,
  deletePantryItem,
} from '../controllers/pantryController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", requireAuth, getPantryList);
router.post("/", requireAuth, addItemForPantry);
router.delete("/:id", requireAuth, deletePantryItem);


export default router;