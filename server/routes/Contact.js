const express = require('express')
const router = express.Router()
const mysql = require("mysql2");
var nodemailer = require('nodemailer');

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "lets_travel"
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'letstravel010101@gmail.com',
      pass: 'ypbwtnatuucapxze'
    }
  });

router.post("/", async (req, res) => {
    var mailOptions = {
        from: 'letstravel010101@gmail.com',
        to: 'kumarrahul32323233@gmail.com',
        subject: req.body.data.subject,
        html: 
        `<!DOCTYPE html><html lang="en"><head><title>User response</title></head><body>`+
        `<h1 style="color: red; text-align: center;">${req.body.data.subject}</h1><p><strong>Name - `+
        `</strong><span>${req.body.data.name}</span></p><p><strong>Email - </strong><span>${req.body.data.email}</span></p>`+
        `<p><strong>Phone no - </strong><span>${req.body.data.phoneno}</span></p> <p><strong>Suggestion - `+
        `</strong><span>${req.body.data.suggestion}</span></p></body></html>`
      };
      
      await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.json({error: "There was an error sending your response"});
        } else {
          res.json({success: "Response sent successfully"});
        }
      });
})

module.exports = router;