const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // mongodb connection string
    const con = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection successfull..");
  } catch (err) {
    console.log(err);
    console.log("Connection failed");
  }
};

module.exports = connectDB;
