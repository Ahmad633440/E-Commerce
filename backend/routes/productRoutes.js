import express from 'express';
import { adminRoutes, protectedRoute } from '../middleware/authMiddleware.js';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getRecommendedProducts } from '../controllers/productController.js';


const router = express.Router();

router.get('/', protectedRoute, adminRoutes, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/recommendations', getRecommendedProducts);
router.post("/", protectedRoute, adminRoutes, createProduct);
router.post("/:id", protectedRoute, adminRoutes, deleteProduct);


export default router;