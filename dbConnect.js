const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.MONGODB_URL  //|| "mongodb://0.0.0.0:27017/News_app";

const dbConnection = () => {
    mongoose.connect(uri);
    console.log("db connect");
}

module.exports = dbConnection;