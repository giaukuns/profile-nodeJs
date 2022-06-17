const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const passValidator = require("password-validator");
const bcrypt = require("bcrypt");
const connectDB = require("../../utils/connectDb");
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

const login = async (req, res) => {
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
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const errors = [
        {
          msg: "Email không tồn tại",
          param: "email",
        },
      ];
      return res.status(400).json({
        success: false,
        errors,
      });
    }
    await bcrypt.compare(req.body.password, user.password).then((data) => {
      if (!data) {
        const errors = [
          {
            msg: "Mật khẩu không chính xác",
            param: "password",
          },
        ];
        return res.status(400).json({
          success: false,
          errors,
        });
      }
    });
    const payload = {
      email: user.email,
      password: user.password,
    };

    await await jwt.sign(
      payload,
      `${process.env.JWT_PRIVATE_KEY}`,
      { expiresIn: 3600 * 24 * 7 },
      (err, token) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            token: token,
            expires: 3600 * 24 * 7,
            type: "Bearer",
            success: true,
            message: "Đăng nhập thành công",
          });
        }
      }
    );
  } catch (e) {
    return res.status(500).json({
      data: null,
      errors: [{ message: e.message }],
    });
  }
};
module.exports = {
  login,
};
