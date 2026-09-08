require('dotenv').config();

const dns = require('dns');

dns.setServers([
    '8.8.8.8',
    '8.8.4.4'
]);
const express = require('express');
const app = express();
const main = require('./config/database');
const cookieparser = require('cookie-parser');
const User = require('./models/User');
const redisClient = require('./config/redis')
const problemRouter = require('./routes/problemauthCreator')
const authRouter = require('./routes/userAuthentication');
const submitRouter = require('./routes/submit');
const cors = require('cors');
const chat = require('./routes/ai');


// app.use(cors({
//     origin:  'http://localhost:5173',
//     credentials:true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
// })) // connection between forntend & backend 


app.use(cookieparser());
app.use(express.json());   // COnvert req.body which is in json format into js object 




app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/chat', chat)




const InitalizeConnection = async ()=>{
   try {
    await main();
    console.log("MongoDB Connected");

    await redisClient.connect();
    console.log("Redis Connected");

    app.listen(process.env.PORT, () => {
        console.log("Server is Listening at Port Number " + process.env.PORT);
    });

} catch (err) {
    console.log("Connection Error:", err);
}
}

InitalizeConnection();