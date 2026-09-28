const mongoose = require("mongoose");

require("dotenv").config();


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database started successfully")
    }
    catch (error) {
        console.error("Database unable to start", error);
    }
}

module.exports = connectDB;