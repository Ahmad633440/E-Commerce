import Stripe from "stripe";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Coupon from "../models/couponModel.js";
import { stripe } from "../lib/stripe.js";
 

export const createCheckoutSession = async (req, res) => {
try {
 const { products, couponCode } = req.body;
 
 if(!products || products.length === 0) {
    return res.status(400).json({ message: 'No products provided for checkout.' });
 }
 let totalAmount = 0;

 const lineItem = products.map(product => {
    const amount = Math.round(product.price * 100); // Convert to cents for stripe
    totalAmount += product.price * product.quantity;

    // Return line item object for Stripe
    return {
        price_data: {
            currency: 'usd',
            product_data: {
                name: product.name,
                Images: [product.images],
            },
            unit_amount: amount,
        },
        quantity: product.quantity,
    };
 });

 // Handle coupon if provided
 let coupon = null;
    if(couponCode) {
        coupon = await Coupon.findOne({ code:couponCode,isActive:true });
    if(coupon.expiryDate < new Date()) {
        return res.status(400).json({ message: 'Coupon has expired.' });
    };
    if(coupon) {
        if(coupon.type === 'percentage') {
            totalAmount = totalAmount - (totalAmount * (coupon.value / 100));
        } else if(coupon.type === 'fixed') {
            totalAmount = totalAmount - coupon.value;
        }
    }
    }

    // Create Stripe Checkout Session
    const session = await stripe.Checkout.SessionsResource.create({
        payment_method_types: ['card'],
        line_items: lineItem,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URI}/purchaseSuccess?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URI}/purchase-cancel`,
        discounts: coupon ? [
            {
                coupon: await createStripeCoupon(coupon.discountPercentage),
            },
        ] : [],

        // Store relevant metadata about the order
        metadata: { 
            userId: req.user._id.toString(),
            couponCode: coupon ? coupon.code : "",
            products: JSON.stringify(
                products.map((p) => ({
                 id: p._id,
                 quantity: p.quantity,
                 price: p.price,
                }))
            ),
        
        },
    });

    if(totalAmount >= 20000){
        await createNewCoupon(req.user._id);
    } 

    res.status(200).json({ id: session.id, totalAmount: totalAmount/100});

            

} catch (error) { 
    res.status(500).json({ message: 'Server Error ', error: error.message });
}
}

async function createStripeCoupon(discountPercentage) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: 'once',
    });
    return coupon.id;
};

async function createNewCoupon(userId){
    const newCoupon = new Coupon({
        code: `GIFT ${Math.floor(1000 + Math.random() * 9000)}`,
        discountPercentage: 10,
        expiryDate: new Date(Date.now() + 30*24*60*60*1000), // 30 days from now
        userId: userId,
    });
    await newCoupon.save();
}


export const checkoutSuccess = async (req, res) => {
    try {
       const { sessionId } = req.body;
       const session = await stripe.checkout.sessions.retrieve(session_id);
       
       // use mongoose model and check if coupon have change the status after using
       if(session.payment_status === 'paid'){
        if(session.metadata.couponCode){
            await Coupon.findOneAndUpdate({
                code: session.metadata.couponCode,
                userid: session.metadata.userId,
                isActive: true
            },{ isActive: false });
        }

    const Products = JSON.parse(session.metadata.products);
    
    const newOrder = new Order({
        user: session.metadata.userId,
        products: Products.map(product => ({
        //these items are cominng from orderModel.js  file
          product: product.id,
          quantity: product.quantity,
          price:price.quantity,
    })),
     totalAmount: session.amount_total / 100, //convert from cents to dollars
     stripeSessionId: sessionId
    })    

    new newOrder.save()

    res.status(200).json({
        success: true,
        message: `Order successful, order placed, coupon deactivated if used`,
        orderid: newOrder._id
    })

       }
    } catch (error) {
        res.status(500).json({ message: 'Server Error ', error: error.message });
    }
}