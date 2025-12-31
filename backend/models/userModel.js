import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Name is required'],
    },
    email: {
        type: String,
        required: [true,'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true,'Password is required'],
        minlength: [6,'Password must be at least 6 characters long'],
    },
    cartItems: [
    {
    quantity:{
        type: Number,
        required: true,
        default: 1,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    }
    ],
    role:{
        type: String,
        enum: ['Customer','Admin'],
        default: 'Customer',
    }

}, {
    timestamps: true,
})

//pre-save hook to hash password before saving to DB
userSchema.pre('save', async function(next){
   if(!this.isModified('password')) return next();
   try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
   } catch (error) {
    // res.status(500).json({message: error.message});
    
   }
})

userSchema.methods.comparePassword = async function (password){
    return bcrypt.compare(password, this.password)
};

const User = mongoose.model('User',userSchema);

export default User;