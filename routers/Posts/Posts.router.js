const {
createPosts,
getAllPost,
getPostByUser,
deletePost
  } = require("../../controllers/Post/posts.controller");
    
  const express = require("express");
  const router = express.Router();
  
  router.post("/createPost", createPosts);
  router.get("/getAllPost", getAllPost);
  router.get("/getPostByUser/:id", getPostByUser);
  router.put("/delete/:id",deletePost)
  module.exports = router;