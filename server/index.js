import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import commentsRoutes from "./routes/comments.js";
import likesRoutes from "./routes/likes.js";
import postsRoutes from "./routes/posts.js";
import usersRoutes from "./routes/users.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

/* MIDDLEWARES */
app.use((req, res, next) => {
  res.header("access-Control-Allow-Credentials", true);
  /* We be able send cokkies */

  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

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
app.use("/api/comments", commentsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);

app.listen(8800, () => {
  console.log("Server is working!");
});
