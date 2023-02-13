import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPins = (req, res) => {
  const userId = req.params.userId;

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Logged in to see posts");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is no valid");

    const q =
      userId == userInfo.id
        ? "SELECT * FROM pins WHERE userId = ?"
        : "SELECT pins.*, posts.isPrivate FROM pins LEFT JOIN posts ON (pins.id = posts.pinId) WHERE pins.userId = ? AND posts.isPrivate = 0";

    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
