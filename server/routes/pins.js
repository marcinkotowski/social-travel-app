import express from "express";
import { getPins } from "../controllers/pin.js";

const router = express.Router();

router.get("/:userId", getPins);

export default router;
