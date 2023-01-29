import express from "express";
import { getAllPosts, addPost, getUserPosts } from "../controllers/post.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:userId", getUserPosts);
router.post("/", addPost);

export default router;
