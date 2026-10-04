const jwt = require('jsonwebtoken');
const User = require('../models/User');
const redisClient = require('../config/redis');

const userMiddleware = async (req,res,next)=>{
   
    try {
       
        const token = req.cookies.token;
       
        if(!token)
            throw new Error("Invalid Token")
        
        const payload = jwt.verify(token, process.env.KEY);
        
        const {_id} = payload;
        if(!_id)
            throw new Error("Invalid Token");

        const result = await User.findById(_id);
       
        if(!result)
            throw new Error("Invalid Token");
        
        const isBlocked = await redisClient.exists(`token:${token}`);
        if(isBlocked)
            throw new Error("Invalid Token");

        req.result = result;
        next();
        
    } catch (err) {
       res.status(403).send("Unauthorized");
    }



}

const adminMiddleware = async (req,res,next)=>{

    try {
        
        const {token} = req.cookies;
       
        if(!token)
            throw new Error("Invalid Token")
        
        const payload = jwt.verify(token, process.env.KEY);

        const {_id} = payload;
       
        if(!_id || payload.role!="Admin")
            throw new Error("Invalid Token");

        const result = await User.findById(_id);
        
        if(!result)
            throw new Error("Invalid Token");
        
        const isBlocked = await redisClient.exists(`token:${token}`);
        if(isBlocked)
            throw new Error("Invalid Token");

        req.result = result;
        next();
        
    } catch (err) {
        res.status(403).send("Unauthorized");
    }


}

module.exports = {userMiddleware,adminMiddleware};