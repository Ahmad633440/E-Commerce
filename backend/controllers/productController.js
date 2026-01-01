import Product from "../models/productModel.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products =  await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error in getAllProduct Controller' });
  }
};


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
};


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, isFeatured } = req.body;

    let cloudinaryResponse = null; 
    if(image){
    cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: 'products'}, )

    const newProduct = new Product({
      name,
      description,
      price,
      isFeatured,
      imageURl: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
      category,
    })
    const savedProduct = await newProduct.save();
    return res.status(201).json({ message: 'Product created successfully', product: savedProduct  
    });

    }
  } catch (error) {
    console.log(`error in product creation controller`);
    return res.status(500).json({ message: 'Server Error in createProduct Controller' });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
  if(product.imageURl){
   const publicId = product.imageURl.split('/').pop().split('.')[0]; // Extract public ID from URL
   try {
    await cloudinary.uploader.destroy(`products/${publicId}`);
   } catch (error) {
    console.log('Error deleting image from Cloudinary:', error);
    return res.status(500).json({ message: 'Error deleting image from Cloudinary' });
   }
  }
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Product deleted successfully'
    });


  } catch (error) {
    console.log(`errror in deleting product controller`);
    return res.status(500).json({ message: 'Server Error in deleteProduct Controller' });
  }
};


export const getRecommendedProducts = async (req, res) => {
  try {
const products = await Product.aggregate([
  {
    $sample: {size:3}
  },
  {
    $project:{
      _id:1,
      name:1,
      price:1,
      description:1,
      image:1
    }
  }
])    
res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Server Error in getRecommendedProducts Controller' });
  }
};


export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
     const products = await Product.find({ category: category });
     if(products.length === 0){
      return res.status(404).json({ message: 'No products found in this category' });
     }
      res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error in getProductsByCategory Controller' });
  }
};


export const toggleFeaturedProduct = async (req, res) => {
  try {
   const product = await Product.findById(req.params.id);
   if (!product) {
    return res.status(404).json({ message: 'Product not found' });
   }
  product.isFeatured = !product.isFeatured;// Toggle Feature logic
  await product.save();
  await updateFeaturedProductsCache();

  res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server Error in toggleFeaturedProduct Controller' });
  }
};

async function updateFeaturedProductsCache() {
  try {
   const featuredProducts = await Product.find({ isFeatured: true}).lean();
   await redis.set("featured_Products", JSON.stringify(featuredProducts), { EX: 3600 }); // Expires in 1 hour
    console.log("Featured Products cache updated in Redis");
  } catch (error) {
    res.status(500).json({ message: 'Server Error in updateFeaturedProductsCache' });
  }
}