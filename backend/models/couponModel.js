import mongoose from "mongoose";

const couponModel = new mongoose.Schema({
code: {
    type:String,
    required:true,
    unique:true,
 },
discountPercentage: {
    type:Number,
    required:true,
    },
expiryDate: {
    type:Date,
    required:true,
    },
isActive: {
    type:Boolean,
    default:true,
},
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
    unique:true,
}
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponModel);

export default Coupon;