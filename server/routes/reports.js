import express from "express";
import { getReportPost, reportPost } from "../controllers/report.js";

const router = express.Router();

router.get("/:id", getReportPost);
router.post("/", reportPost);

export default router;
