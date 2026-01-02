import express from 'express';
import { getCoupon, validateCoupon } from '../controllers/couponControllers.js';
import { protectedRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectedRoute ,getCoupon)
router.get('/validate', protectedRoute ,validateCoupon)

export default router;