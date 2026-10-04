const mongoose = require('mongoose');

const main = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (err) {
        console.log("Database is not Connected: " + err.message);
        throw err;
    }
};


module.exports = main;