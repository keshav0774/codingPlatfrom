const {createClient} = require('redis');

// const redisClient = createClient({
//     username: 'default',
//     password: process.env.REDIS_PASS,
//     socket: {
//         host: 'redis-10578.crce206.ap-south-1-1.ec2.cloud.redislabs.com',
//         port: 10578
//     }
// })
const redisClient = createClient({
    username: 'default',
    password: process.env.REDISPASSWORD,
    socket: {
        host: 'redis-16714.c14.us-east-1-2.ec2.cloud.redislabs.com',
        port: 16714
    }
});

module.exports = redisClient;


