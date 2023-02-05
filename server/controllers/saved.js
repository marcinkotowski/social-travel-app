import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getSaved = (req, res) => {
  const q = "SELECT userId FROM saved WHERE postId = ?";

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userId));
  });
};

export const addSave = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Logged in to add post!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is no valid");

    const q = "INSERT INTO saved (`userId`, `postId`) VALUES (?)";

    const values = [userInfo.id, req.body.postId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been liked");
    });
  });
};

export const deleteSave = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Logged in to add post!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is no valid");

    const q = "DELETE FROM saved WHERE `userId` = ? AND `postId` = ?";

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been unliked");
    });
  });
};
