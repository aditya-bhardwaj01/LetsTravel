const express = require('express');
const router = express.Router();
const mysql = require("mysql2");

const { verify } = require("jsonwebtoken");
const { response } = require('express');
/*const { default: AddPost } = require('../../client/src/components/AddPost');*/

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

const deleteComment = (res, postId) => {
    return new Promise((resolve, reject) => {
        db.query("delete from comment where postid=?", [postId],
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

const addPost = (res, imageUrl, formData, validToken, profilepic) => {
    return new Promise((resolve, reject) => {
        db.query("insert into post (post_text, post_images, username, userid, post_title, location, userimage) values (?, ?, ?, ?, ?, ?, ?)", 
        [formData.posttext, imageUrl, validToken.username, validToken.id, formData.posttitle, formData.postlocation, profilepic.userimage],
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

const getUserImage = (res, validToken, profilepic) => {
    return new Promise((resolve, reject) => {
        db.query("select profile_pic from user where id = ?", [validToken.id],
        (err, result) => {
            if(err){
                res.json({error: "Check your connection or try after sometime."})
            }
            else{
                profilepic.userimage = result[0].profile_pic;
                resolve("SUCCESS");
            }
        })
    })
}

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

router.post('/currProfile', (req, res) => {
    const accessToken = req.body.accessToken;
    const validToken = verify(accessToken, "chalaaja");

    res.json(validToken.username);
})

router.post('/deletePost', (req, res) => {
    const postId = req.body.postId;
    const accessToken = req.body.accessToken;
    const validToken = verify(accessToken, "chalaaja");
    const username = validToken.username

    const execute = async () => {
        posts = {}
        await deletePost(res, postId);
        await deleteComment(res, postId);
        await fetchPosts(res, posts, username)
        res.json(posts);
    }

    execute()
})

router.post('/addPost', (req, res) => {
    const imageUrl = req.body.imageUrl;
    const formData = req.body.formData;
    profilepic = {userimage: ""};
    const accessToken = req.body.accessToken;
    const validToken = verify(accessToken, "chalaaja");

    const execute = async () => {
        posts = {}
        await getUserImage(res, validToken, profilepic)
        await addPost(res, imageUrl, formData, validToken, profilepic)
        await fetchPosts(res, posts, validToken.username)
        res.json(posts);
    }

    execute()
})


module.exports = router;