import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware.js';
import { checkoutSuccess, createCheckoutSession } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-checkout-session', protectedRoute, createCheckoutSession);
router.post('/create-success', protectedRoute, checkoutSuccess);

export default router;