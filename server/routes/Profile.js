const express = require('express');
const router = express.Router();
const mysql = require("mysql2");

const { verify } = require("jsonwebtoken");
const { response } = require('express');

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "lets_travel"
})

const fetchProfileDetails = (res, profilepage, username) => {
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

const fetchPosts = (res, profilepage, username) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * from post where username=? order by date desc", [username],
        (err, result)=> {
            if(err){
                res.json({error: "Could not load page!"});
            }
            else{
                profilepage.posts = result;
                resolve("SUCCESS");
            }
        })
    })
}

const deletePost = (res, postId) => {
    return new Promise((resolve, reject) => {
        db.query("delete from post where id=?", [postId],
        (err, result) => {
            if(err){
                res.json({error: "Check your connection or try after sometime."})
            }
            else{
                resolve("SUCCESS");
            }
        })
    })
}

router.post('/deletePost', (req, res) => {
    const postId = req.body.postId;
    const accessToken = req.body.accessToken;
    const validToken = verify(accessToken, "chalaaja");
    const username = validToken.username

    const execute = async () => {
        posts = {}
        await deletePost(res, postId);
        await fetchPosts(res, posts, username)
        res.json(posts);
    }

    execute()
})

router.post('/currProfile', (req, res) => {
    const accessToken = req.body.accessToken;
    const validToken = verify(accessToken, "chalaaja");

    res.json(validToken.username);
})

router.post('/', (req, res) => {
    const username = req.body.username

    const execute = async () => {
        profilepage = {}
        await fetchProfileDetails(res, profilepage, username);
        await fetchPosts(res, profilepage, username);
        res.json(profilepage);
    }

    execute();
})

module.exports = router;