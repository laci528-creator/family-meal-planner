import express from 'express';
import {
  getPantryList,

} from '../controllers/pantryController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", requireAuth, getPantryList);


export default router;