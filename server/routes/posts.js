import express from "express";
import { getPosts, addPost, getSavedPosts } from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/", getSavedPosts);
router.post("/", addPost);

export default router;
