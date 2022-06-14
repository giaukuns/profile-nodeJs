const { createUser } = require("../../controllers/User/CreateUser");
const { getUser } = require("../../controllers/User/getAllUser");
const { resetPassword } = require("../../controllers/User/ResetPassword");
const express = require("express");
const router = express.Router();

router.post("/createUser", createUser);
router.get("/getUser", getUser);
router.put("/resetpassword/:id", resetPassword);
module.exports = router;
