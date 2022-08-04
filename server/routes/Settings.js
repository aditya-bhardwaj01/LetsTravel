const express = require('express')
const router = express.Router();
const mysql = require("mysql2");

const {verify} = require("jsonwebtoken");
const { response } = require('express');

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

router.post("/saveImage", (req, res) => {
    const imageUrl = req.body.imageUrl;
    const accessToken = req.body.accessToken;

    const validToken = verify(accessToken, "chalaaja");

    db.query(
        "UPDATE user set profile_pic = ? where id = ?", [imageUrl, validToken.id],
        (err, result) => {
            if(err){
                res.json({error: "Please check your connection or try after sometime"});
            }
            else{
                res.json(result);
            }
        }
    )
})

module.exports = router;