import express from 'express';
import {
  getShoppingList,
  generateShoppingList,
  updateShoppingItemStatus,
  removeItemFromShoppingList,
  addItemToShoppingList
  /*clearShoppingList,*/
} from '../controllers/shoppingController.js';

import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getShoppingList);
router.post("/generate",requireAuth,generateShoppingList);
router.patch(
  "/status",
  requireAuth,
  updateShoppingItemStatus
);
router.delete('/', requireAuth, removeItemFromShoppingList);
router.post('/', requireAuth, addItemToShoppingList);
/*router.patch("/:id", requireAuth, updateShoppingItem);

router.delete('/', requireAuth, clearShoppingList);*/

export default router;