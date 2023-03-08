import { db } from "../connect.js";

export const searchProfile = (req, res) => {
  // Later add request params and map data with LIKE CONCAT

  const q =
    "SELECT * FROM users WHERE (username LIKE CONCAT('%', ?,  '%') OR name LIKE CONCAT('%', ?,  '%'))";

  db.query(q, ["parameter", "parameter"], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
