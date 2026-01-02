import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
 try {
  const { productId } = req.body;
  const user = req.user;
  
  const existingProduct = user.cart.find(item => item.productId.toString() === productId);
  if(existingProduct) {
    existingProduct.quantity += 1;
  } else {
    user.cart.push({ productId, quantity: 1 });
    }
    await user.save();
    res.status(200).json({ message: 'Product added to cart successfully', cart: user.cart });
        
    } catch (error) {
        res.status(500).json({ message: 'Server Error in addToCart cont' });
    }
};

export const removeAllFromCart = async (req, res) => {
    try {
 const user = req.user;
    user.cart = [];
    await user.save();
    res.status(200).json({ message: 'All products removed from cart', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'Server Error in removeAllFromCart cont' });
    }
};

export const getCartProducts = async (req, res) => {
    try {
 const products = await Product.find({_id:{$in: req.user.cart}});

// Map quantities from user cart to products
const cartitems = products.map(product => {
    const item = req.user.cart.find(item => item.id === product.id);
    return {
        ...product.toJSON(),
        quantity: item ? item.quantity : 0
    };
});

res.status(200).json({
    message: 'Cart products fetched successfully',
    cartitems
    });

    } catch (error) {
        res.status(500).json({ message: 'Server Error in getCartProducts cont' });
    }
};

export const updateQuantity = async (req, res) => {
    try {
    const { id:productId, quantity } = req.body;
    const user = req.user;
    const productInCart = user.cart.find(item => item.productId.toString() === productId);
    if (productInCart) {
        productInCart.quantity = quantity;
        await user.save();
        res.status(200).json({ message: 'Product quantity updated', cart: user.cart });
    } else {
        res.status(404).json({ message: 'Product not found in cart' });
    }
    } catch (error) {
        res.status(500).json({ message: 'Server Error in updateQuantity cont' });
    }
};