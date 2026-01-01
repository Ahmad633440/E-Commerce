import express from 'express';
import { adminRoutes, protectedRoute } from '../middleware/authMiddleware.js';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductsByCategory, getRecommendedProducts, toggleFeaturedProduct } from '../controllers/productController.js';


const router = express.Router();

router.get('/', protectedRoute, adminRoutes, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/recommendations', getRecommendedProducts);
router.get('/category/:category', getProductsByCategory);
router.post("/", protectedRoute, adminRoutes, createProduct);
router.post("/:id", protectedRoute, adminRoutes, deleteProduct);
router.post("/:id", protectedRoute, adminRoutes, toggleFeaturedProduct);


export default router;