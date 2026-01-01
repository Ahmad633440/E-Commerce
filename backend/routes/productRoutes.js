import express from 'express';
import { adminRoutes, protectedRoute } from '../middleware/authMiddleware.js';
import { getAllProducts, getFeaturedProducts } from '../controllers/productController.js';


const router = express.Router();

router.get('/', protectedRoute, adminRoutes, getAllProducts);
router.get('/featured', getFeaturedProducts);

export default router;