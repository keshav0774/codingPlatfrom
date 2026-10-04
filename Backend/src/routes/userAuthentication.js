const express = require('express');
const authRouter = express.Router();
const {register,login,logout,getProfile, emailVerify, adminRegister,deleteProfile,forgetPassword, verifyOtp} = require('../controllers/userauthenticate');
const {userMiddleware,adminMiddleware} = require('../middleware/midleware');



authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/verifyOtp', verifyOtp)
authRouter.post('/logout',userMiddleware,logout);
authRouter.get('/getProfile', userMiddleware,  getProfile);
authRouter.post("/emailverify",emailVerify)
authRouter.post('/admin/register' ,adminRegister);
authRouter.post('/admin/login',login);
authRouter.post("/admin/emailverify",emailVerify)
authRouter.post('/admin/logout', adminMiddleware, logout)
authRouter.delete('/deleteprofile', userMiddleware, deleteProfile)
authRouter.post('/forgetPassword', forgetPassword)



module.exports = authRouter;