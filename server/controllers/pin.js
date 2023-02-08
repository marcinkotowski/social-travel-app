import { db } from "../connect.js";

export const getPins = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM pins WHERE userId = ?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
