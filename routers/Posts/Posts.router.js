const {
createPosts,
getAllPost,
getPostByUser
  } = require("../../controllers/Post/posts.controller");
    
  const express = require("express");
  const router = express.Router();
  
  router.post("/createPost", createPosts);
  router.get("/getAllPost", getAllPost);
  router.get("/getPostByUser/:id", getPostByUser);
  module.exports = router;