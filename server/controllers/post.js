import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.params.userId;
  const saved = req.query.type === "saved" ? true : undefined;

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Logged in to see posts");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is no valid");

    let q = `SELECT posts.*, countryCode, customDisplayName, u.id AS userId, name, profilePic 
             FROM posts 
             JOIN users AS u ON (u.id = posts.userId) 
             LEFT JOIN pins ON (pins.userId = u.id AND pins.postId = posts.id)`;
    let values = [];

    if (saved) {
      q += `JOIN saved ON (saved.postId = posts.id AND saved.userId = ?) 
            WHERE (posts.isPrivate = 0 OR (posts.isPrivate = 1 AND posts.userId = ?)) 
            ORDER BY posts.createdAt DESC`;
      values = [userInfo.id, userInfo.id];
    } else if (userId) {
      if (userId == userInfo.id) {
        q += `WHERE posts.userId = ? 
              ORDER BY posts.createdAt DESC`;
      } else {
        q += `WHERE (posts.userId = ? AND posts.isPrivate = 0) 
              ORDER BY posts.createdAt DESC`;
      }
      values = [userId];
    } else {
      q += `LEFT JOIN relationships AS r ON (posts.userId = r.followedUserId) 
            WHERE ((r.followerUserId = ? OR posts.userId = ?) AND (posts.isPrivate = 0 OR (posts.isPrivate = 1 AND posts.userId = ?))) 
            ORDER BY posts.createdAt DESC`;
      values = [userInfo.id, userInfo.id, userInfo.id];
    }

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getUserPosts = (req, res) => {
  const userId = req.params.userId;

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Logged in to see posts");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is no valid");

    const q =
      userId == userInfo.id
        ? "SELECT posts.*, countryCode, u.id AS userId, name, profilePic FROM posts JOIN users AS u ON (u.id = posts.userId) LEFT JOIN pins ON (pins.userId = u.id AND pins.postId = posts.id) "
        : "SELECT posts.*, countryCode, u.id AS userId, name, profilePic FROM posts JOIN users AS u ON (u.id = posts.userId) LEFT JOIN pins ON (pins.userId = u.id AND pins.postId = posts.id) ";

    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Logged in to add post!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is no valid");

    const queryPost =
      "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`, `isPrivate`) VALUES (?)";

    const valuesPost = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.isPrivate,
    ];

    db.query(queryPost, [valuesPost], (err, dataPost) => {
      if (err) return res.status(500).json(err);

      if (!req.body.selectedlocation)
        return res.status(200).json("Post without location has been created");

      const postId = dataPost.insertId;
      const { lat, lon, address } = req.body.selectedlocation;
      const queryPin =
        "INSERT INTO pins (`lat`, `lon`, `countryCode`, `customDisplayName`, `postId`, `userId`) VALUES (?)";

      const valuesPin = [
        lat,
        lon,
        address.country_code,
        JSON.stringify(req.body.selectedlocation.customDisplayName),
        postId,
        userInfo.id,
      ];

      db.query(queryPin, [valuesPin], (err, dataPin) => {
        if (err) return res.status(500).json(err);

        const pinId = dataPin.insertId;
        const queryUpdatePinId = "UPDATE posts SET pinId = (?) WHERE id = (?)";

        db.query(queryUpdatePinId, [pinId, postId], (err, updateDataPost) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Post with location has been created");
        });
      });
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Logged in to see posts");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is no valid");

    const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

    const value = [req.params.id, userInfo.id];

    db.query(q, value, (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows === 0)
        return res.status(403).json("You can delete only your post");
      return res.status(200).json("Post has been deleted");
    });
  });
};
