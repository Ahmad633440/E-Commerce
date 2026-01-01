import User from "../models/userModel.js";

export const protectedRoute = async (req,res,next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new Error('No token found');
    }
    
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
        throw new Error('User not found');
    }    
    req.user = user;
    next();
    } catch (error) {
        if(error.name === 'TokenExpiredError') {
            console.log('Token has expired');
            return res.status(401).json({
                message: "Session expired! Please login again to access this route."  
            });
        }
    }
    
  } catch (error) {
    console.log(`error in protected Routes`);
    res.status(401).json({
        message: "Unauthorized Access! Please login to access this route."  
    });
  }
}


export const adminRoutes = (req,res,next) => {
    try {
        const user = req.user;
        if(user.role !== 'admin'){
            return res.status(403).json({
                message: "Forbidden Access! Only admin have permission to access this route."
            });
    next();
        }
    } catch (error) {
     res.status(403).json({
        message: "Forbidden Access! You don't have permission to access this route."  
        });
    }
};