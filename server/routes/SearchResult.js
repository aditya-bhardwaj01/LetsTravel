const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "lets_travel"
});

const fetchPosts = async (res, location) => {
    return new Promise((resolve, reject) => {
        db.query("select * from post where location like ?", ['%' + location + '%'],
        (err, result) => {
            if(err){
                res.json({error: "Check your connection or try after sometime."})
            }
            else{
                res.json(result)
                resolve("SUCCESS")
            }
        })
    })
}

router.post('/', async(req, res) => {
    const location = req.body.searchInput;
    const execute = async () => {
        await fetchPosts(res, location);
    }

    execute();
})


module.exports = router