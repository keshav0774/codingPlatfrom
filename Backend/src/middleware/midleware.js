const jwt = require('jsonwebtoken');
const User = require('../models/User');
const redisClient = require('../config/redis');

const userMiddleware = async (req,res,next)=>{
    console.log("HEADER", req.headers.cookie)
    try {
        console.log("All Cookies", req.cookie)
        const token = req.cookies.token;
        console.log("Token:", token ? "Present" : "Missing");
        if(!token)
            throw new Error("Invalid Token")
        
        const payload = jwt.verify(token, process.env.KEY);
        console.log("Payload", payload)
        const {_id} = payload;
        if(!_id)
            throw new Error("Invalid Token");

        const result = await User.findById(_id);
        console.log("USer", result)
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

    //Check the Redis Blacklist if token already present then logout it.

}

const adminMiddleware = async (req,res,next)=>{

    try {
        console.log("admin middleware Called")
        const {token} = req.cookies;
        console.log(token)
        if(!token)
            throw new Error("Invalid Token")
        
        const payload = jwt.verify(token, process.env.KEY);

        const {_id} = payload;
        console.log(_id)
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

    //Check the Redis Blacklist if token already present then logout it.

}

module.exports = {userMiddleware,adminMiddleware};