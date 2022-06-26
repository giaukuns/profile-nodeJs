const {
  createMeta,
  getMeta,
  updateMeta,
} = require("../../controllers/Home/home.controller");

const express = require("express");
const router = express.Router();

router.post("/createMeta", createMeta);
router.get("/getMeta", getMeta);
router.put("/updateMeta/:id", updateMeta);
module.exports = router;
