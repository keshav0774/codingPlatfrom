const express = require("express");
const chat = express.Router(); 
const chatWithAI = require('../controllers/chatAi'); 
const {userMiddleware} = require('../middleware/midleware');


chat.post('/ai', userMiddleware, chatWithAI); 


module.exports = chat; 