const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const { sign } = require('jsonwebtoken');

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "lets_travel"
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM user WHERE username = ?", [username],
    (err, result) => {
      if (err) {
        console.log(err);
        res.json({ error: "Database error" });
      } else {

        if (result.length == 0) res.json({ error: "User doesn't exist" })

        else {
          bcrypt.compare(password, result[0]['password']).then(async (match) => {
            if (!match) res.json({ error: "Wrong Username And Password Combination" })

            else {
              const accessToken = sign({ username: result[0]['username'], id: result[0]['id'] }, "chalaaja")
              res.json(accessToken);
            }
          });
        }
      }
    }
  )
})

router.post("/", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phoneno;
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM user WHERE username = ?", [username],
    (err, result) => {
      if (err) {
        res.json({ error: "Database error" });
      } else {
        if (result.length > 0) res.json({ error: "This username already exists" })

        else {

          bcrypt.hash(password, 10).then((hash) => {
            db.query(
              "INSERT INTO user (username, password, name, email, phone) VALUES (?,?,?,?,?)",
              [username, hash, name, email, phone],
              (err, result) => {
                if (err) {
                  console.log(err);
                  res.json({ error: "Database error" });
                } else {
                  res.json("SUCCESS");
                }
              }
            );
          });

        }
      }
    }
  )
});

module.exports = router;
