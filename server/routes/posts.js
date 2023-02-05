import express from "express";
import { getAllPosts, addPost, getSavedPosts } from "../controllers/post.js";

const router = express.Router();

router.get("/all", getAllPosts);
router.get("/saved", getSavedPosts);
router.post("/", addPost);

export default router;
