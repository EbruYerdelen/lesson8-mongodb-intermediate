const mongoose = require("mongoose");
require("dotenv").config();


const connectToDB = async () => {
  try {
      if (!process.env.MONGODB_URI) {
        console.log("provide db url");
        return;
      }
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed");
    process.exit(1);
  }
};
module.exports = connectToDB;
