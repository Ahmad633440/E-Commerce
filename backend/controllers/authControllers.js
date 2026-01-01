import User from '../models/userModel.js';
import { redis } from '../lib/redis.js';
import jwt from 'jsonwebtoken';


const generateToken = (userId) => {
  const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15min'});
  const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'});
  
  return {accessToken, refreshToken};
}

const storeRefreshToken = async (userId,refreshToken) => {
   await redis.set(`refresh_Token:${userId}`,refreshToken,"Ex",30*24*60*60); //30 days
}

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 
  });
}

export const Signup = async (req, res) => {
  try {
    const {name, email, password} = req.body;
    
    if(!name || !email || !password) {
      return res.status(400).json({message:"All fields are required"});
    }
    
    const userExists = await User.findOne({email});
    if(userExists){
        return res.status(400).json({message:`User already exist`});
    }
    
    const user = await User.create({name, email, password});

    //authenticate 
    const {accessToken, refreshToken} = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    //Cookies
    setCookies(res, accessToken, refreshToken);
    
    res.status(201).json({
      message:"User created successfully",
      user: {id: user._id, name: user.name, email:user.email}
    });
    
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

export const Login = async (req, res) => {
 try {
  const {email, password} = req.body;
  if(!email || !password){
    return res.status(400).json({message: "All fields are required"});
  }
  const user = await User.findOne({email});
  if(!user){
    return res.status(400).json({message: "Invalid Credentials"});
  }
   
  const isMatch = await user.comparePassword(password);
  if(!isMatch){
    return res.status(400).json({message: "wrong password"});
  };

  //generate tokens
  const {accessToken, refreshToken} = generateToken(user._id);
  await storeRefreshToken(user._id, refreshToken);
  //set cookies
  setCookies(res, accessToken, refreshToken);

  res.status(200).json({
    message: "Login successful",
    user: {id: user._id, name: user.name, email: user.email,role: user.role}
  });

 } catch (error) {
  console.log(error);
  res.status(500).json({message: error.message});
 }
}

export const Logout =async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
      return res.status(400).json({message: "Refresh token not found"});
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = decoded.userId;
    //delete refresh token from redis
    await redis.del(`refresh_Token:${userId}`);
    //clear cookies
    await res.clearCookie('accessToken');
    await res.clearCookie('refreshToken');

    res.status(200).json({message: "Logged out successfully"});

  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
}

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
      return res.status(400).json({message: "Refresh token not found"});
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = decoded.userId;
    const storedRefreshToken = await redis.get(`refresh_Token:${userId}`);

    if(storedRefreshToken !== refreshToken){
      return res.status(401).json({message: "Invalid refresh token"});
    }
    const {accessToken, refreshToken: newRefreshToken} = generateToken(userId);
    await storeRefreshToken(userId, newRefreshToken);
    //set cookies
    setCookies(res, accessToken, newRefreshToken);
    res.status(200).json({message: "Token refreshed successfully"});

  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

// export const getProfile = async (req, res) => {
//   try {
     
//   } catch (error) {
//     res.status(500).json({message: error.message});
//   }
// }