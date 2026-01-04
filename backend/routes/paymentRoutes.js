import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware.js';
import { createCheckoutSession } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-checkout-session', protectedRoute, createCheckoutSession);

export default router;