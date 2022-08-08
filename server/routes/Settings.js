const express = require('express')
const router = express.Router();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

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

router.post("/updateProfile", (req, res) => {
  const accessToken = req.body.accessToken;
  const validToken = verify(accessToken, "chalaaja");
  const username = req.body.data.username;
  const name = req.body.data.name;
  const phone = req.body.data.phoneno;
  const email = req.body.data.email;
  const profession = req.body.data.profession;
  const city = req.body.data.city;
  const state = req.body.data.state;
  const country = req.body.data.country;
  const zipcode = req.body.data.zipcode;
  const about = req.body.data.about;
  const skills = req.body.data.skills;
  const password = req.body.data.password;

  const checkUserName = async () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT username from user where id <> ?', [validToken.id], function(err, result) {
        if(err){
          res.json({error: "Error!"});
        }
        else{
          result.forEach(element => {
            if(element.username == username){
              res.json({exists: "This username already exists so changes were not applied!"})
              resolve("exist");
            }
            resolve("success");
          });
        }
      })
    })
  }

  const updateUser = async () => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE user set username=?, name=?, email=?, phone=?, about=?, skills=?, profession=?,'+
      'city=?, state=?, country=?, zip_code=? where id=?', [username, name, email, phone, about, skills, profession, city
      , state, country, zipcode, validToken.id], 
      function(err, result) {
        if(err){
          res.json({error: "Error!"});
        }
        else{
          resolve("SUCCESS");
        }
      })
    })
  }

  const updatePost = async () => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE post set username=? where userid=?', [username, validToken.id],
      function(err, result) {
        if(err){
          res.json({error: "Error!"});
        }
        else{
          resolve("SUCCESS");
        }
      })
    })
  }

  const updateComment = async () => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE comment set username=? where userid=?', [username, validToken.id],
      function(err, result) {
        if(err){
          reject("Error!");
        }
        else{
          resolve("SUCCESS");
        }
      })
    })
  }

  const updatePassword = async () => {
    if(password == "No change"){
      return new Promise((resolve, reject) => {
        res.json("SUCCESS");
      })
    }
    else{
      return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10).then((hash) => {
          db.query(
            "UPDATE user set password=? where id=?",
            [hash, validToken.id],
            (err, result) => {
              if (err) {
                console.log(err);
                res.json({ error: "Error!" });
              } else {
                res.json("SUCCESS");
              }
            }
          );
        });
      })
    }
  }

  const execute = async () => {
    if(await checkUserName() == 'success'){
      await updateUser()
      await updatePost()
      await updateComment()
      await updatePassword()
    }
  }
  
  execute();
})

router.post("/saveImage", (req, res) => {
    const imageUrl = req.body.imageUrl;
    const accessToken = req.body.accessToken;

    const validToken = verify(accessToken, "chalaaja");

    const updateUser = async () => {
        return new Promise((resolve, reject) => {
          db.query('UPDATE user set profile_pic = ? where id = ?', [imageUrl, validToken.id] , function (err, result) {
            if(err){
                res.json({error: "Please check your connection or try after sometime"});
            }
            else{
                resolve("SUCCESS");
            }
          });
        });
      };

    const updateComment = async (image) => {
        return new Promise((resolve, reject) => {
          db.query('UPDATE comment set userimage = ? where userid = ?', 
          [imageUrl, validToken.id], function(error, results) {
            if(error){
                res.json({error: "Please check your connection or try after sometime"});
            }
            else{
              resolve("SUCCESS");
            }
          })
        })
      }

      const updatePost = async () => {
        return new Promise((resolve, reject) => {
          db.query("UPDATE post set userimage = ? where userid = ?", [imageUrl, validToken.id], function(error, result) {
            if(error) {
                res.json({error: "Please check your connection or try after sometime"});
            }
            else{
              res.json("SUCCESS");
            }
          })
        })
      }

      const execute = async () => {
        await updateUser()
        await updateComment()
        await updatePost()
      }
      
      execute();
})

module.exports = router;