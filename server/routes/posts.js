import express from "express";
import {
  getAllPosts,
  addPost,
  getSavedPosts,
  deletePost,
} from "../controllers/post.js";

const router = express.Router();

router.get("/all", getAllPosts);
router.get("/saved", getSavedPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);

export default router;
