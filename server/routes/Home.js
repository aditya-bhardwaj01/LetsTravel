const express = require("express");
const router = express.Router();
const mysql = require('mysql2');

const { verify } = require("jsonwebtoken");

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "lets_travel"
});

router.post("/", async (req, res) => {
  const accessToken = req.body.accessToken;

  const validToken = verify(accessToken, "chalaaja");

  db.query(
    "SELECT * FROM post WHERE userid <> ? order by date desc", [validToken.id],
    (err, result) => {
      if (err) {
        res.json({ error: "Unable to load posts" });
      } else {
        res.json(result);
      }
    }
  )
});

router.post("/comments", async (req, res) => {
  const postId = req.body.postId;

  db.query(
    "SELECT * FROM comment WHERE postid = ? order by date desc", [postId],
    (err, result) => {
      if (err) {
        res.json({ error: "Database error" });
      } else {
        res.json(result);
      }
    }
  )
});

router.post("/comments/post", async (req, res) => {
  const postId = req.body.postId;
  const commentText = req.body.commentText;
  const accessToken = req.body.accessToken;

  const validToken = verify(accessToken, "chalaaja");

  const fetchUserImage = async (profileImage) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT profile_pic FROM user where id = ?`, [validToken.id] , function (error, results) {
        console.log("fetchUserImage")
        if(error){
          console.log(error);
          res.json({error: "Database error"});
        }
        else{
          profileImage.userimage = results
          resolve(profileImage);
        }
      });
    });
  };
  
  const addComment = async (image) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO comment (comment_text, userid, username, postid, userimage) VALUES (?,?,?,?,?)', 
      [commentText, validToken.id, validToken.username, postId, image[0].profile_pic], function(error, results) {
        console.log("addComment")
        if(error){
          console.log(error);
          res.json({error: "Database error"});
        }
        else{
          resolve("SUCCESS");
        }
      })
    })
  }

  const sendComments = async () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM comment WHERE postid = ? order by date desc", [postId], function(error, result) {
        console.log("sendComments")
        if(error) {
          console.log(error);
          res.json({error: "Database error"});
        }
        else{
          res.json(result);
        }
      })
    })
  }
  
  const execute = async () => {
    let profileImage = {};
    await fetchUserImage(profileImage)
    await addComment(profileImage.userimage)
    await sendComments()
  }
  
  execute();
});

router.post("/comments/delete", async(req, res) => {
  const commentId = req.body.commentId
  const postId = req.body.postId

  const deleteComment = async () => {
    return new Promise((resolve, reject) => {
      db.query("delete from comment where id=?", [commentId] , function (error, results) {
        if(error){
          res.json({error: "Could not delete! Please try after sometime."});
        }
        else{
          resolve("SUCCESS");
        }
      });
    });
  };

  const sendComments = async () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM comment WHERE postid = ? order by date desc", [postId], function(error, result) {
        if(error) {
          res.json({error: "Sorry an error has occured!"});
        }
        else{
          res.json(result);
        }
      })
    })
  }

  const execute = async () => {
    await deleteComment()
    await sendComments()
  }
  
  execute();
})

module.exports = router;