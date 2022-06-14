const { login } = require("../../controllers/User/login");
const express = require("express");
const router = express.Router();
router.post("/login", login);
module.exports = router;
