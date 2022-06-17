const mongoose = require("mongoose");
const connectDB = require("../../utils/connectDb");
/**
 * Khai báo model
 */
const User = require("../../models/User/user");
/**
 * Tìm user
 */
const getUser = async (req, res) => {
  connectDB();
  try {
    const findUser = await User.find().select("-password");
    const data = {
      findUser,
    };
    return res.status(200).json({
      success: true,
      msg: "Tìm Kiếm thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
};
module.exports = {
  getUser,
};
