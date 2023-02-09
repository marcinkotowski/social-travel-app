import express from "express";
import {
  getPosts,
  getUserPosts,
  addPost,
  deletePost,
} from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:userId", getUserPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);

export default router;
