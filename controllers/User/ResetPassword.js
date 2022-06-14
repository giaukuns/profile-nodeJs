const mongoose = require("mongoose");
const validator = require("validator");
const passValidator = require("password-validator");
const bcrypt = require("bcrypt");
const connectDB = require("../../utils/connectDb");
/**
 * Khai báo model
 */
const User = require("../../models/User/user");
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
 * Cập nhật mật khẩu
 */
const resetPassword = async (req, res) => {
  try {
    connectDB();
    const pass = req.body.password;
    const resetpass = req.body.resetpassword;
    if (!pass || pass !== resetpass) {
      return res.status(400).json({
        data: null,
        errors: [{ message: "Mật khẩu mới không chính xác." }],
      });
    }
    if (!passSchema.validate(resetpass)) {
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

    const updatePass = await bcrypt.hash(resetpass, 10);
    //const id = mongoose.Types.ObjectId(req.query.id);
    let { id } = req.params;
    // console.log("pass 1", pass);
    // console.log("pass 2", resetpass);
    // console.log("newUser", updatePass);
    // console.log("_id", id);
    await User.updateOne({ _id: id }, { password: updatePass }, { new: true });
    const _dataResult = await User.findOne({ _id: id }).select(
      "email firstName lastName fullName"
    );
    console.log("_dataResult", _dataResult);
    return res.status(200).json({
      success: true,
      msg: "Thay đổi mật khẩu thành công",
      data: _dataResult,
    });
  } catch (e) {
    return res.status(500).json({
      data: null,
      errors: [{ message: e.message }],
    });
  }
};
module.exports = {
  resetPassword,
};
