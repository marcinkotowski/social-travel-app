import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import savedRoutes from "./routes/saved.js";
import searchRoutes from "./routes/search.js";
import postRoutes from "./routes/posts.js";
import pinRoutes from "./routes/pins.js";
import userRoutes from "./routes/users.js";
import relationshipRoutes from "./routes/relationships.js";
import reportRoutes from "./routes/reports.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import helmet from "helmet";

/* MIDDLEWARES */
app.use((req, res, next) => {
  res.header("access-Control-Allow-Credentials", true);
  /* We be able send cokkies */

  next();
});
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/relationships", relationshipRoutes);

app.listen(8800, () => {
  console.log("Server is working!");
});
