const express = require('express');
const router = express.Router();
const mysql = require("mysql2");

const { verify } = require("jsonwebtoken");

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "lets_travel"
})

router.post('/', (req, res) => {
    const username = req.body.username

    const fetchProfileDetails = (profilepage) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * from user where username=?", [username],
            (err, result) => {
                if(err){
                    res.json({error: "Coluld not load page!"});
                }
                else{
                    profilepage.profile = result
                    resolve("SUCCESS");
                }
            })
        })
    }

    const fetchPosts = (profilepage) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * from post where username=?", [username],
            (err, result)=> {
                if(err){
                    res.json({error: "Coluld not load page!"});
                }
                else{
                    profilepage.posts = result;
                    resolve("SUCCESS");
                }
            })
        })
    }


    const execute = async () => {
        profilepage = {}
        await fetchProfileDetails(profilepage);
        await fetchPosts(profilepage);
        res.json(profilepage);
    }

    execute();
})

module.exports = router;