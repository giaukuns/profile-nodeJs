const mongoose = require("mongoose");
const validator = require("validator");
const passValidator = require("password-validator");
const bcrypt = require("bcrypt");
const connectDB = require("../../utils/connectDb");
const cloudinary = require("../../middlewares/cloudinary");
const { format } = require("date-fns");

/**
 * Khai báo model
 */
const User = require("../../models/User/user.model");
const passSchema = new passValidator();
const passMinLen = 6;
const passMaxLen = 24;

// Scheme for password validation
// See ref https://github.com/tarunbatra/password-validator
passSchema
  .is()
  .min(passMinLen)
  .is()
  .max(passMaxLen)
  .has()
  .letters()
  .has()
  .digits();
/**
 * tạo user
 */
const createUser = async (req, res) => {
  try {
    connectDB();
    if (!req.body.email || !validator.isEmail(req.body.email)) {
      return res.status(400).json({
        data: null,
        errors: [{ message: "Email không hợp lệ" }],
      });
    }
    if (!passSchema.validate(req.body.password)) {
      return res.status(400).json({
        data: null,
        errors: [
          {
            message:
              "Mật khẩu phải dài 6-24 ký tự, bao gồm cả chữ cái và chữ số",
            code: "err001",
          },
        ],
      });
    }
    const checkEmail = await User.find({ email: req.body.email });

    if (checkEmail.length > 0) {
      return res.status(400).json({
        data: null,
        errors: [
          {
            message: "Email này đã được sử dụng.",
          },
        ],
      });
    }
    const date = format(new Date(), "yyyy/MM/dd");
    const image = req.body.avatar;
    const images_cloud = image.map(async (item) => {
      const result_data = await cloudinary.v2.uploader.upload(
        item,
        {
          folder: `avatar/images/${date}`,
          format: "jpg",
          transformation: [
            {
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) return error.message;
          if (result) return result;
          return "Unknow Error";
        }
      );
      // fix size app
      await cloudinary.v2.uploader.upload(
        item,
        {
          transformation: [
            {
              height: 320,
              width: 320,
              crop: "pad",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
          public_id: result_data.public_id.concat("_tn"),
        },
        (error, result) => {
          if (result) return result;
          if (error) return error.message;
          return "Unknow Error";
        }
      );

      return result_data;
    });

    const url_images = await Promise.all(images_cloud);
    const newUser = new User({
      ...req.body,
      avatar: url_images,
    });
    
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    const result = await newUser.save();

    await User.find();

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
/**
 * Find all user
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

/**
 * Find User by Id
 */
 const getUserById = async (req, res) => {
  connectDB();
  try {
    let { id } = req.params;
    const findUser = await User.findById({ _id: id }).select("-password");
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
  createUser,
  getUser,
  getUserById
};
