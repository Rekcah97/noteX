const mongoose = require("mongoose");
const mongoURI = process.env.DATABASE_URL;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);

    console.log("Connected DB:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ Mongo connection error:", error);
    process.exit(1);
  }
};

module.exports = connectToMongo;
