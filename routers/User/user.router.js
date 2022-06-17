const {
  createUser,
  getUser,
  getUserById,
} = require("../../controllers/User/User.controller");

const { resetPassword } = require("../../controllers/User/resetPassword");

const express = require("express");
const router = express.Router();

router.post("/createUser", createUser);
router.get("/getUser", getUser);
router.get("/getUserById/:id", getUserById);
router.put("/resetpassword/:id", resetPassword);
module.exports = router;
