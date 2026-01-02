import Coupon from '../models/couponModel.js';

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({userId:req.user._id,isActive:true});
        if(!coupon){
            return  res.status(404).json({ message: "No active coupon found for this user." });
        }
    res.status(200).json(coupon || null);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const validateCoupon = async (req, res) => {
    try {
    const { code } = req.query;
    const coupon = await Coupon.findOne({ code: code,user: req.user._id ,isActive: true });
    if (!coupon) {
        return res.status(404).json({ message: "Invalid or inactive coupon code." });
    }
    if (coupon.expiryDate < new Date()) {
     coupon.isActive = false;
     await coupon.save();
     return res.status(400).json({
         message: "Coupon has expired.",
         code: coupon.code
         });
    }

    res.status(200).json({ message: "Coupon is valid.", coupon });

    
    } catch (error) {
res.status(500).json({ message: "Server Error", error: error.message });
    }
}