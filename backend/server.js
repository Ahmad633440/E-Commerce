import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import { connectDB } from './lib/db.js';
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import couponRoutes from './routes/couponRoutes.js'

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupon', couponRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port:http://localhost:${PORT}`);

  connectDB(process.env.MONGO_URI);
});

