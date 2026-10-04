const express = require("express");
const chatWithAI = require('../controllers/chatAi'); 
const {userMiddleware} = require('../middleware/midleware');


const chat = express.Router(); 
chat.post('/ai', userMiddleware, chatWithAI); 


module.exports = chat; 