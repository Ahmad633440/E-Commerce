import express from 'express';
import { adminRoutes, protectedRoute } from '../middleware/authMiddleware.js';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductsByCategory, getRecommendedProducts, toggleFeaturedProduct } from '../controllers/productController.js';


const router = express.Router();

router.get('/featured', getFeaturedProducts);
router.get('/recommendations', getRecommendedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/', protectedRoute, adminRoutes, getAllProducts);
router.post("/", protectedRoute, adminRoutes, createProduct);
router.delete("/:id", protectedRoute, adminRoutes, deleteProduct);
router.patch("/:id", protectedRoute, adminRoutes, toggleFeaturedProduct);


export default router;