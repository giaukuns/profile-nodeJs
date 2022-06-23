const mongoose = require("mongoose");
const connectDB = require("../../utils/connectDb");
const cloudinary = require("../../middlewares/cloudinary");

const { format } = require("date-fns");
/**
 * import model
 */
const Posts = require("../../models/Post/posts.model");
const Users = require("../../models/User/user.model");

const createPosts = async (req, res) => {
  try {
    connectDB();
    const date = format(new Date(), "yyyy/MM/dd");
    const images = req.body.image;
    const images_cloud = images.map(async (item) => {
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
      image: url_images,
      userId: req.user.id,
    });

    const result = await newPosts.save();
    await Posts.find();

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

const getAllPost = async (req, res) => {
  connectDB();
  try {
    const findAllPost = await Posts.find();
    const data = {
      findAllPost,
    };
    return res.status(200).json({
      success: true,
      msg: "Tìm Kiếm thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
};

const getPostByUser = async (req, res) => {
  try {
    connectDB();
    let { id } = req.params;
    const findPostbyUser = await Posts.find({ userId: id })
      .where({ status: true })
      .select("title description content image.url");
    const data = {
      findPostbyUser,
    };
    return res.status(200).json({
      success: true,
      msg: "Tìm Kiếm thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
};

const deletePost =async (req, res) => {
  try{
    let { id } = req.params;
    await Posts.findByIdAndUpdate(
      { _id: id },
      { status: false }
    );
    return res.status(200).json({
      success: true,
      msg: "Xóa bài viết thành công",
      data: null,
    });
  }catch(error){
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }

}

module.exports = {
  createPosts,
  getAllPost,
  getPostByUser,
  deletePost
};
