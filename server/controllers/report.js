import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getReportPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Logged in to see posts");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is no valid");

    const q =
      "SELECT postId, userId FROM reports WHERE `postId` = ? AND `userId` = ?";

    const value = [req.params.id, userInfo.id];

    db.query(q, value, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const reportPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Logged in to see posts");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is no valid");

    const q = "INSERT INTO reports (`postId`, `userId`) VALUES (?)";

    const value = [req.body.postId, userInfo.id];

    db.query(q, [value], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Report has been sended");
    });
  });
};
