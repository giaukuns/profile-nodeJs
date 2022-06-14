/**
 * pass:GLPikXm3dgQqj7mX
 */
/**
 *
 */

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB readyState: " + mongoose.connection.readyState);
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("MongoDB Connected: " + mongoose.connection.readyState);
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDB;
