import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getSearch = (req, res) => {
  const searchQuery = req.query.query;
  const lat = req.query.lat;
  const lon = req.query.lon;

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Logged in to see posts");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is no valid");

    let q = "";
    let value = [];

    if (searchQuery) {
      q = `SELECT * FROM users 
         WHERE (username LIKE CONCAT('%', ?,  '%') OR name LIKE CONCAT('%', ?,  '%'))`;
      value = [searchQuery, searchQuery];
    } else if (lat && lon) {
      q = `SELECT posts.*, countryCode, customDisplayName, u.id AS userId, name, profilePic 
      FROM posts 
      JOIN users AS u ON (u.id = posts.userId) 
       JOIN pins ON (pins.userId = u.id AND pins.postId = posts.id)
      LEFT JOIN relationships AS r ON (posts.userId = r.followedUserId) 
      WHERE ((pins.lat = ? AND pins.lon = ?) AND (posts.isPrivate = 0 OR (posts.isPrivate = 1 AND posts.userId = ?))) 
      ORDER BY posts.createdAt DESC`;
      value = [lat, lon, userInfo.id];
    }

    db.query(q, value, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
