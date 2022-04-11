const express = require('express') ;
const fetch = require('node-fetch');

const router = express.Router();

router.post('/sendNotif' , (req , res) => {

    let notification = {
        'title' : 'Title of notification' , 
        'message' : 'Subtitles' 
    } ; 

    let fcm_tokens = [] ; 
    let notification_body = {
        'notification' : notification , 
        'registration_ids'  : fcm_tokens

    }
    fetch('https://fcm.googleapis.com/fcm/send' , {
        'method' : 'POST' ,
        'headers' : {
            'Authorization' : 'key='+SERVER_KEY , 
            'Content-Type' : 'application/json'
        } , 
        'body' : JSON.stringify(notification_body)

    }).then (()=> {
        res.status(200).send('Notification sent successfully !')
    }).catch ((err)=> {
        res.status(400).send('Something went wrong') ; 
        console.log(err) ; 

    })
})

module.exports = router ; 
