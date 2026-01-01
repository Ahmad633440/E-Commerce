import mongoose from "mongoose";

 const productModel = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,
  },
  price:{
    type:Number,
    required:true,
    min:0,
  },
  category:{
    type:String,
    required:true,
  },
  image:{
    type:String,
    required:[true,'Please provide image URL'],
  },
  isFeatured:{
    type:Boolean,
    default:false   
  },
  rating:{
    type:Number,
    default:0,
    max:5,
    min:0
  }
},{
    timestamps:true
})

 const Product = mongoose.model('Product', productModel);   
 export default Product;