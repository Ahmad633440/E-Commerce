import mongoose from "mongoose";

export const connectDB = async(url) => {
    try {
       const conn = await mongoose.connect(url);
       console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`error in connecting with mongoDB`);
        process.exit(1);
    }
}