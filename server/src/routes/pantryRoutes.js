import express from 'express';
import {
  getPantryList,
  addItemForPantry,

} from '../controllers/pantryController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", requireAuth, getPantryList);
router.post("/", requireAuth, addItemForPantry);


export default router;