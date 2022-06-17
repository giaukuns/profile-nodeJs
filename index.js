require("dotenv").config();
/**
 * Khai báo thư viện
 */
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
// khai báo routers
/*-Khai báo database-*/
const connectDB = require("./utils/connectDb.js");
/**
 * Khai báo model
 */
const User = require("./routers/User/user.router");
const Login = require("./routers/User/login");
const app = express();
const port = process.env.PORT;
/*-Gọi kết nối database-*/
connectDB();
/**
 *
 */
app.use(bodyParser.urlencoded({ extended: true })); // => khai báo để sử dụng req.body (lấy ra những biến POST)
app.use(bodyParser.json());

/**
 *login mid
 */
app.use(passport.initialize());
require("./authenticate/passport")(passport);
/**
 *
 */

app.use("/api/v1", Login);
// app.use(passport.authenticate("jwt", { session: false })); //Kiểm ta đăng nhập
app.use("/api/v1/user", User);
app.listen(port, (err) => {
  if (err) return console.error(err);
  return console.log("Connect server successfully");
});
module.exports = app;
