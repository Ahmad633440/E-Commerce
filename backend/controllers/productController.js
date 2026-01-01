import Product from "../models/productModel.js";
import { redis } from "../lib/redis.js";

export const getAllProducts = async (req, res) => {
  try {
    const products =  await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error in getAllProduct Controller' });
  }
}


export const getFeaturedProducts = async (req, res) => {
  try {
  let featuredProducts = await redis.get("featured_Products");
  if (featuredProducts) {
    console.log("Featured Products fetched from Redis");
    return res.status(200).json(JSON.parse(featuredProducts));
  }
// If not found in Redis, fetch from MongoDB
   featuredProducts = await Product.find({ isFeatured: true }).lean();//.lean give plain JS object instead of Mongoose document
   res.status(200).json(featuredProducts);
   if (!featuredProducts) {
    return res.status(404).json({ message: 'No featured products found' });
   }
   //store in Redis for future requests
   await redis.set("featured_Products", JSON.stringify(featuredProducts), { EX: 3600 }); // Expires in 1 hour
   console.log("Featured Products stored in Redis");
   res.json(featuredProducts);

  } catch (error) {
    res.status(500).json({ message: 'Server Error in getFeaturedProducts Controller' });
  }
}

