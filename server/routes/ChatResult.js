const express = require('express');
const router = express.Router();
const mysql = require("mysql2");

const { verify } = require('jsonwebtoken');
const { response } = require('express');

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "lets_travel"
})

const getContactsId = (validToken, res, contacts) => {
    return new Promise((resolve, reject) => {
        db.query('select b.username, b.profile_pic, a.person2, a.person1 from contacts a INNER JOIN user b where (a.person1 = ? and b.id = a.person2) or (a.person2 = ? and b.id = a.person1)  order by date desc', 
        [validToken.id, validToken.id], (err, result) => {
            if(err) {
                res.json({error: "Unable to fetch your contacts!!"})
            }
            else{
                result.forEach(element => {
                    if(element.person2 === validToken.id) element.person2 = element.person1
                });
                contacts.details = result
                contacts.myusername = validToken.username
                resolve("SUCCESS");
            }
        })
    })
}

const fetchContactDetails = (contactId, messages, res) => {
    return new Promise((resolve, reject) => {
        db.query('select username, profile_pic from user where id = ?', [contactId],
        (err, result) => {
            if(err){
                res.json({error: "There was an issue fetching the details!!"})
            }
            else{
                messages.contactUsername = result[0].username,
                messages.contactProfilepic = result[0].profile_pic
                resolve("SUCCESS")
            }
        })
    })
}

const getMessages = (validToken, res, contactId, messages) => {
    //console.log(validToken.id, contactId)
    return new Promise((resolve, reject) => {
        db.query('select a.*, b.username, b.profile_pic from messages a INNER JOIN user b where ((a.sender_id=? and a.receiver_id=?) or (a.sender_id=? and a.receiver_id=?)) and b.id=a.sender_id order by date asc',
        [validToken.id, contactId, contactId, validToken.id, contactId], async (err, result) => {
            if(err) {
                res.json({error: "Unable to fetch your messages!!"})
            }
            else{
                await fetchContactDetails(contactId, messages, res)
                messages.messages = result
                resolve("SUCCESS")
            }
        })
    })
}

const addMessage = (validToken, receiverId, newMessage, res) => {
    return new Promise((resolve, reject) => {
        db.query('insert into messages(sender_id, receiver_id, message) values (?,?,?)', 
        [validToken.id, receiverId, newMessage], 
        (err, result) => {
            if(err){
                res.json({error: 'Unable to send your message. Please try after some time'});
            }
            else{
                resolve("SUCCESS")
            }
        })
    })
}

const updateContactDate = (validToken, receiverId, res) => {
    return new Promise((resolve, reject) => {
        db.query('update contacts set date = ? where (person1=? and person2=?) or (person1=? and person2=?)',
        [new Date(), validToken.id, receiverId, receiverId, validToken.id],
        (err, result) => {
            if(err){
                res.json({error: 'Unable to update contacts'});
            }
            else{
                resolve("SUCCESS");
            }
        })
    })
}

router.post('/contacts', (req, res) => {
    const accessToken = req.body.accessToken
    const validToken = verify(accessToken, "chalaaja")
    const contacts = {}

    const execute = async () => {
        await getContactsId(validToken, res, contacts)
        res.json(contacts)
    }

    execute()
})

router.post('/message', (req, res) => {
    const accessToken = req.body.accessToken
    const validToken = verify(accessToken, "chalaaja")
    const contactId = req.body.contactId
    const messages = {}

    const execute = async () => {
        await getMessages(validToken, res, contactId, messages)
        res.json(messages)
    }

    execute()
})

router.post('/addMessage', (req, res) => {
    const accessToken = req.body.accessToken
    const validToken = verify(accessToken, 'chalaaja')
    const receiverId = req.body.receiverId
    const newMessage = req.body.newMessage
    const messages = {}

    const execute = async () => {
        await addMessage(validToken, receiverId, newMessage, res);
        await updateContactDate(validToken, receiverId, res);
        //await getMessages();
        res.json(messages)
    }

    execute()
})


module.exports = router;