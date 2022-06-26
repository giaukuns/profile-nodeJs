const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

const Home = new Schema({
  title: String,
  description: String,
});

module.exports = mongoose.model("Home", Home);
