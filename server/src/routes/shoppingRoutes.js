import express from 'express';
import {
  getShoppingList,
  addItemToShoppingList,
  removeItemFromShoppingList,
  clearShoppingList,
} from '../controllers/shoppingController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getShoppingList);
router.post('/', requireAuth, addItemToShoppingList);
router.patch("/:id", requireAuth, updateShoppingItem);
router.delete('/:id', requireAuth, removeItemFromShoppingList);
router.delete('/', requireAuth, clearShoppingList);

export default router;