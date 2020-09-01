const express = require("express");
//import { admin } from '../config'
const router = express.Router();
var connection = require('../config');
var admin = require("firebase-admin");

var serviceAccount = require("../sevasram-8c339-firebase-adminsdk-lhhfl-3aa9db7714.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sevasram-8c339.firebaseio.com"
});

router.post('/listNotification', function(req, res) {

    console.log(res)
    user_id = req.body.user_id;
    user_type = req.body.user_type;
    //connection.query('select id from users where agent_id=?', [user_id], function(error, results, fields) {
    ///var id = results[0].id
    if (user_type == 1)

        query = "SELECT title,description,DATE_FORMAT(posted_date, '%d/%m/%Y')  as posted_on FROM notification where notification_to in (0,1) or user_id='" + user_id + "'";
    else
        query = "SELECT title,description,DATE_FORMAT(posted_date, '%d/%m/%Y')  as posted_on FROM notification where notification_to in (0,2) or user_id='" + user_id + "'";
    connection.query(query, function(error, results, fields) {
        if (error) {



            res.json({
                status: false,
                message: 'there are some error with query'
            })

        } else {
            if (results.length > 0) {

                res.json({
                    status: 1,
                    message: 'notifications retreived successfully',
                    notification_data: results

                })
            } else {
                res.json({
                    status: 0,
                    message: "Failed to retreive notifications"
                });
            }


        }
        res.end();



    });

    // });
});


// const notification_options = {
//     priority: "high",
//     timeToLive: 60 * 60 * 24
// };
router.post('/firebase/notification', (req, res) => {

    const registrationToken = req.body.registrationToken
    var user_id = req.body.user_id;
    connection.query('select title, description from notification where user_id=?', [user_id], function(err, result) {

        var message = result[0].description;
        var title = result[0].title;

        console.log(message);
        var payload = {
            data: {
                title: title,
                message: message,
            }
        };
        //const options = notification_options

        var options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };

        admin.messaging().sendToDevice(registrationToken, payload, options)
            .then(function(response) {

                res.status(200).send("Notification sent successfully")

            })
            .catch(error => {
                console.log(error);
            });
    });
})

router.post('/sendnotification', (req, res) => {

   // const registrationToken = req.body.registrationToken
    var user_id = req.body.user_id;
    var notification_to=req.body.notification_to;
    var message = req.body.message;
   var title = req.body.title;
   var topic = '/topics/all';
    var query;
    var payload = {
        data: {
            title: title,
            message: message,
        },
        topic: topic
    };
    
    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    if(notification_to=="0")
    {
        query="select firebase_token from users" ;
    }
    else if(notification_to=="1")
    {
        query="select firebase_token from users where user_type_id=1" ;
    }
    else if(notification_to=="2")
    {
        query="select firebase_token from users where user_type_id=2" ;
    }
    else if(notification_to=="3")
    {
        query="select firebase_token from users where agent_id='"+user_id+"'" ;
    }
    else 
    {
        query="select firebase_token from users where agent_id='"+subscriber_id+"'" ;
    }
        connection.query(query, function(err, result) {
      
            for(i=0;i<result.length;i++)
            {
                if(result[i].firebase_token!="")
                {
                    admin.messaging().subscribeToTopic(result[i].firebase_token, payload, options)
                    .then(function(response) {

                        res.status(200).send("Notification sent successfully")

                    })
                    .catch(error => {
                        console.log(error);
                    });
                }
               
            }
                        
    
            console.log(message);
           
            //const options = notification_options
    
           
        });
    
   
})
router.post('/sendnotificationtoall', (req, res) => {

     var message = req.body.message;
    var title = req.body.title;
    var topic = '/topics/all';
     var query;
     var payload = {
        data: {
            title: title,
            message: message,
            topic: topic
        },
        topic: topic
    };
     
     var options = {
         priority: "high",
         timeToLive: 60 * 60 * 24
     };
     admin.messaging().send(payload)
     .then(function(response) {

         res.status(200).send("Notification sent successfully")

     })
     .catch(error => {
         console.log(error);
     });
                         
     
             console.log(message);
            
             //const options = notification_options
     
            
      
     
    
 })
 
router.post('/firebasetoken', function(req, res) {

    var registrationToken = req.body.registrationToken
    var user_id = req.body.user_id;

    connection.query("select  id from users where agent_id='" + user_id + "' or subscriber_id='" + user_id + "'", function(error, result) {
        var id = result[0].id;
        //console.log(id)


        connection.query("update  users set firebase_token='" + registrationToken + "' where id='" + id + "' ", function(error, results) {
            if (error) {
                console.log(error)
                res.json({
                    status: 0,
                    message: 'there are some error with query'
                })


            } else {

                res.json({
                    status: 1,
                    message: 'token updated successfully',


                })

            }
        });



    });


});
module.exports = router;