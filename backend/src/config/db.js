const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
  try {
    const conn = await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME || "club_membership_manager",
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

