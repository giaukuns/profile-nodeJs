const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

const Posts = new Schema(
  {
    title: String,
    description: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    content: String,
    image: [
      {
        public_id: String,
        url: String,
        width: String,
        height: String,
        secure_url: String,
        asset_id: String,
        signature: String,
        bytes: String,
        etag: String,
        created_at: String,
        version_id: String,
      },
    ],
    status: Boolean,
    type: String,
    createdAt: {
      type: Date,
      get: (v) => moment(v).format("DD/MM/yyyy") + "",
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true },
  }
);

module.exports = mongoose.model("Post", Posts);
