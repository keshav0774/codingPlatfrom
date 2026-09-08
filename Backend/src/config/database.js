// const mongoose = require('mongoose');


// async function main(){
//      try {
//         await mongoose.connect(process.env.DB_CONNECT_STRING);
//         console.log("Database is Connected Successfully");
//      } catch (error) {
//         console.log("Database is not Connected"+ error.message);
//      }
// }
const mongoose = require('mongoose');

const main = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (err) {
        console.log("Database is not Connected: " + err.message);
        throw err;
    }
};

// module.exports = main;
module.exports = main;