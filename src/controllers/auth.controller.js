const userModel=require('../models/user.model')
const jwt=require('jsonwebtoken')
const dcrypt=require('dcryptjs')
async function registerUser(req,res){
    const {username,email,password,role="user"}=req.body;

    const isUserAlreadyExist=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(isUserAlreadyExist){
        return res.status(409).json({
            message:"user already exists"
        })
    }
    const hash=await dcrypt.hash(password,10)
    const user=await userModel.create({
        username,
        email,
        password:hash,
        role
    })
    const token=jwt.sign({
        id:user._id,
        role:user.role,
    },process.env.JWT_SECRET)
    res.cookie('token',token)

    res.status(201).json({
        message:"user registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role,
        }
    })
}
async function loginUser(req,res){
    const{username,email,password}=req.body
    const user=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(!user){
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }
    const isPasswordValid=await dcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }
    const token=jwt.sign({
        id:user._id,
        role:user.role
    },process.env.JWT_SECRET)
    res.cookie("token",token)
    res.status(200).json({
        message:"user logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role
        }
    })
}
async function logoutUser(req,res){
    res.clearCookie("token")
    res.status(200).json({
        message:"User logged out successfully"
        })
}

const mailService = require('../services/mail.service');

async function forgotPassword(req, res) {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 600000; // 10 minutes

    await user.save();

    try {
        await mailService.sendOTP(email, otp);
        res.status(200).json({ 
            message: "OTP sent to your email",
            otp: otp // FOR DEVELOPMENT ONLY - so the user can see it in response
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to send email. Check SMTP config." });
    }
}

async function verifyOTP(req, res) {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ 
        email, 
        resetOTP: otp,
        resetOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Generate a long reset token for the final password change step
    const resetToken = require('crypto').randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;

    await user.save();

    res.status(200).json({ 
        message: "OTP verified",
        resetToken: resetToken 
    });
}

async function resetPassword(req, res) {
    const { token, password } = req.body;

    const user = await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: "Reset session has expired. Please try again." });
    }

    const hash = await dcrypt.hash(password, 10);
    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been successfully reset" });
}

module.exports={registerUser,loginUser,logoutUser,forgotPassword,verifyOTP,resetPassword}