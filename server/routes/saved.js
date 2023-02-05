import express from "express";
import { getSaved, addSave, deleteSave } from "../controllers/saved.js";

const router = express.Router();

router.get("/", getSaved);
router.post("/", addSave);
router.delete("/", deleteSave);

export default router;
