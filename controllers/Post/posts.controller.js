const mongoose = require("mongoose");
const connectDB = require("../../utils/connectDb");
const cloudinary = require("../../middlewares/cloudinary");
const { format } = require("date-fns");
/**
 * import model
 */
const Posts = require("../../models/Post/posts.model");

const createPosts = async (req, res) => {
    try {
      connectDB();
      const date = format(new Date(), "yyyy/MM/dd");
      const image = req.body.avatar;
      const images_cloud = image.map(async (item) => {
        const result_data = await cloudinary.v2.uploader.upload(
          item,
          {
            folder: `post/images/${date}`,
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
      const newPosts = new Posts({
        ...req.body,
        avatar: url_images,
      });
      
      const result = await newPosts.save();
  
      await newPosts.find();
  
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

  module.exports = {
  createPosts
  };