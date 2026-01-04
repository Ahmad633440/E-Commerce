import express from 'express';
import { Login, Logout, Signup, refreshToken } from '../controllers/authControllers.js';
import { protectedRoute } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login );
router.post('/logout', Logout );
router.post('/refresh-token', refreshToken );
router.post('/profile', protectedRoute, getProfile );

export default router;