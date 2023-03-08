import express from "express";
import { searchProfile } from "../controllers/search.js";

const router = express.Router();

router.get("/profile", searchProfile);

export default router;
