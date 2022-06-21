const {
createPosts,
getAllPost
  } = require("../../controllers/Post/posts.controller");
    
  const express = require("express");
  const router = express.Router();
  
  router.post("/createPost", createPosts);
  router.get("/getAllPost", getAllPost);

  module.exports = router;