import express from 'express';
import {
  getShoppingList,
  generateShoppingList,
  updateShoppingItemStatus
  /*addItemToShoppingList,
  removeItemFromShoppingList,
  clearShoppingList,*/
} from '../controllers/shoppingController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getShoppingList);
router.post("/generate",requireAuth,generateShoppingList);
router.patch(
  "/:id",
  requireAuth,
  updateShoppingItemStatus
);
/*router.post('/', requireAuth, addItemToShoppingList);
router.patch("/:id", requireAuth, updateShoppingItem);
router.delete('/:id', requireAuth, removeItemFromShoppingList);
router.delete('/', requireAuth, clearShoppingList);*/

export default router;