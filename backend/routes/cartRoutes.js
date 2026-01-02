import ecpress from 'express';
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from '../controllers/cartController.js';
import { protectedRoute } from '../middleware/authMiddleware.js';

const router = ecpress.Router();

router.post('/', protectedRoute, addToCart);
router.delete('/', protectedRoute, removeAllFromCart);
router.get('/', protectedRoute, getCartProducts);
router.put('/', protectedRoute, updateQuantity);

export default router;