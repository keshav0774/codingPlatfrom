const express = require('express');
const User = require('../models/User');
const Submission = require('../models/submission');
const validate = require('../utlis/validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const validator = require('validator');
const {sendResetEmail,sendVerificationMail, sendWelcomeEmail, sendTempPassword } = require('../controllers/verification')

const register = async (req,res)=>{
    try {
    
   const {firstName, emailId, password} = req.body;
     
   const checkEmail = await User.findOne({emailId});
        if(checkEmail)
            throw new Error("Email Already Registered")
   const hashPassword = await bcrypt.hash(password,10);
    
   const user = await User.create({firstName, emailId, password:hashPassword})
   const reply = {
      firstName : user.firstName,
      emailId : user.emailId,
      _id : user._id,
      role:user.role
   }
   await sendWelcomeEmail(emailId,firstName);
   res.status(200).json({
    user: reply, 
    message: "User Register Successfully"
   });
   console.log(reply)
    
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
}

const login = async (req,res)=>{

    try {
        
        const {emailId, password} = req.body;
           if(!emailId || !password)
            throw new Error("Invalid Credentials");

        const user =  await User.findOne({emailId});
           if(!user)
            throw new Error("Invalid Credentials");
        const ismatch = await bcrypt.compare(password,user.password);
           if(!ismatch)
            throw new Error("Invalid Credentials");

        const reply = {
            firstName : user.firstName,
            emailId : user.emailId,
            _id : user._id,
            role:user.role
        }
        //token'
        const token = jwt.sign({_id:user._id, emailId:user.emailId,role:user.role},process.env.KEY,{expiresIn:'1h'});
        res.cookie("token",token,{ 
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        path:'/',
        maxAge: 60 * 60 * 1000});

        res.status(200).json({
            user : reply,
            message:"Loggin Successfully"
        });



    } catch (err) {
        res.status(400).send("Loging Failed Error: "+err.message);
        
    }
}

const logout = async (req,res)=>{
  try {
    
    const {token} = req.cookies;
    if(!token)
        throw new Error("Invalid Token")
    const payload = jwt.decode(token);

    //put into blocklist
    await redisClient.set(`token:${token}`,'Blocked');
    // set the expiry time
    await redisClient.expireAt(`token:${token}`, payload.exp);

    res.clearCookie("token", null, {expires:new Date(Date.now()),
        httpOnly:true,
        secure:false,
        sameSite:true,
        path:'/'
    });
    res.status(200).send("Logges Out Successfully")
  } catch (err) {
    res.status(401).send("Error: "+err.message);
  }
}
const getProfile = async (req,res)=>{
    try {
        const {_id}  = req.result;
         
        if(!_id) 
            throw new Error("Invalid Crendetial");
        const result = await User.findById(_id);
        if(!result)
            throw new Error("Invalid Crendential");
        const reply = {
            firstName : result.firstName, 
            lastName : result.lastName,
            emailId : result.emailId,
            age : result.age, 
            role : result.role,
           problemSolved : result.problemSolved?.length || 0
        }
        res.status(200).json({
            message: " user details", 
            user : reply
        });
    } catch (err) {
        res.status(400).send()
    }
}

const emailVerify = async (req,res)=>{
   try {
       const {emailId} = req.body;
    if(!emailId )
        throw new Error("Email Not Found");
    
    let check = validator.isEmail(emailId);
    if(!check){
        return res.status().send("Invalid Email ID")
    }
    const result = await User.findOne({emailId})
    
    if(!result)
       return res.status().send("Email Not Register Yet");

    const resetCode = crypto.randomInt(100000, 999999).toString();

    await sendVerificationMail(emailId, resetCode, result.firstName)

    return res.status(200).send("Email Verified")

   } catch (error) {
       res.status(400).send("Error: "+error.message)
   }
}
const adminRegister = async (req,res)=>{
     try {
        // validate the data
        validate(req.body);
   const {firstName, emailId, password} = req.body;
     
   const checkEmail = await User.findOne({emailId});
        if(checkEmail)
            throw new Error("Email Already Registered")
   const hashPassword = await bcrypt.hash(password,10);
   const user = await User.create({firstName, emailId, password:hashPassword,role:"Admin"})
   const token = jwt.sign({_id:user._id, emailId:user.emailId,role:"Admin"},process.env.KEY,{expiresIn:'1h'});
   res.cookie("token",token,{maxAge:60*60*1000});
   const reply  = {
    firstName: user.firstName, 
    emailId : user.emailId,
    _id:user._id,
    role:user.role
   }
   res.status(201).json({
    user:reply,
    message:"Admin Registered Successfully"
   })
    
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
}

const deleteProfile = async(req,res)=>{

    try {
        const userId = req.result._id;
          if (!userId) {
            return res.status(401).send("Unauthorized");
        }
       const user =   await User.findByIdAndDelete(userId);
           if (!user) {
         return res.status(404).send("User not found");
        }

        // 
       await Submission.deleteMany({userId})
       res.status(200).json({
        user:null,
        message:"Profile Is deleted"
       })
    } catch (err) {
        res.status(500).send("Error:" + err.message)
    }
}


const forgetPassword = async(req,res)=>{

   try {
    console.log(req.body)
    const { emailId } = req.body;
    if(!emailId)
        throw new Error("Invalid Credential");
    
    const result = await User.findOne({emailId})
   
    if(result.emailId !== emailId)
        throw new Error("Invalid Credential");
    // 6-digit OTP 
    const resetCode = crypto.randomInt(100000, 999999).toString();
    
    
    await redisClient.set(`reset:${emailId}`, resetCode, { EX: 300 });

   const ans =  await sendResetEmail(emailId, resetCode , result.firstName);
    console.log(ans);
    return res.status(200).send("Code Send SuccessFully", ans)
    } catch (err) {
        res.status(400).send("Internal Server Error: "+err.message)
    }
}

const verifyOtp = async(req,res)=>{

    const { emailId , otp } = req.body;
    if( !emailId || !otp)
        return res.status(403).send("Invalid field"); 
    try {
        const user = await User.findOne({emailId}); 
        if(!user) 
            return res.status(400).send("Invalid Mail")

        const storedOTP = await redisClient.get(`reset:${emailId}`);

        if(storedOTP !== otp)
            return res.status(400).json({ message: "Invalid OTP" });

        const tempPassword = crypto.randomBytes(8).toString('hex');
        const hashPassword = await bcrypt.hash(tempPassword, 10); 

        await User.findOneAndUpdate({emailId}, {password : hashPassword})

        await redisClient.del(`reset:${emailId}`); 

        await sendTempPassword(emailId, tempPassword); 

        res.status(200).json({ message: "Password reset successfully, check your email" });
        
    } catch (err) {
         res.status(400).send("Internal Server Error: "+err.message)
    }
}


module.exports = {register,login, logout,getProfile ,emailVerify,adminRegister,deleteProfile,forgetPassword, verifyOtp};