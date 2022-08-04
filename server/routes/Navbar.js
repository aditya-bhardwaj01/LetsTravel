const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const {verify} = require("jsonwebtoken");

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "lets_travel"
});

router.post("/", (req, res) => {
    const accessToken = req.body.accessToken;

    const validToken = verify(accessToken, "chalaaja");
    
    db.query(
        "SELECT username, profile_pic FROM user WHERE id = ?", [validToken.id],
        (err, result) => {
          if (err) {
            res.json({ error: "Database error" });
          } else {
              res.json({link: result[0]['profile_pic'], username: result[0]['username']});
          }
        }
      )
});
  
module.exports = router;