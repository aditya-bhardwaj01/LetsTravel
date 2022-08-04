const express = require('express')
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
        "SELECT * FROM user WHERE id = ?",[validToken.id],
        (err, result) => {
            if(err){
                res.json({ error: "There was an error loading the page" });
            }
            else{
                res.json(result);
            }
        }
    )
})

module.exports = router;