import express from "express";
import {
  getPosts,
  getUserPosts,
  addPost,
  deletePost,
} from "../controllers/post.js";

const router = express.Router();

router.get("/:userId?", getPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);

export default router;
