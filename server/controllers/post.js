import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Logged in to see posts");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is no valid");

    const q =
      userId !== "undefined"
        ? "SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC"
        : "SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createdAt DESC";

    const value =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, value, (err, data) => {
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
      "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)";

    const valuesPost = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(queryPost, [valuesPost], (err, dataPost) => {
      if (err) return res.status(500).json(err);

      if (!req.body.selectedlocation)
        return res.status(200).json("Post without location has been created");

      const postId = dataPost.insertId;
      const { lat, lon, address } = req.body.selectedlocation;
      const queryPin =
        "INSERT INTO pins (`lat`, `lon`, `country`, `customDisplayName`, `postId`, `userId`) VALUES (?)";

      const valuesPin = [
        lat,
        lon,
        address.country,
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

          console.log([dataPin, dataPost, updateDataPost]);
          return res.status(200).json("Post with location has been created");
        });
      });
    });
  });
};
