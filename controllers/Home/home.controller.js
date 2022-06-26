const mongoose = require("mongoose");
const connectDB = require("../../utils/connectDb");
/**
 * import model
 */
const Home = require("../../models/Home/home.model");

const createMeta = async (req, res) => {
  try {
    connectDB();
    const newTitle = new Home({
      ...req.body,
    });

    const result = await newTitle.save();
    await Home.find();

    return res.status(200).json({
      success: true,
      msg: "Thêm mới thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
};

const getMeta = async (req, res) => {
  try {
    connectDB();
    const findTitle = await Home.findOne();
    const data = {
      findTitle,
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
const updateMeta = async (req, res) => {
  try {
    connectDB();
    let { id } = req.params;
    const update = await Home.findOneAndUpdate(
      { _id: id },
      { title: req.title, description: req.description }
    );
    return res.status(200).json({
      success: true,
      msg: "Update bài viết thành công",
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
};

module.exports = {
  createMeta,
  getMeta,
  updateMeta,
};
