const express = require("express");
const router = express.Router();
var connection = require('../config');



router.get('/search', function(req, res) {

    userid = req.body.userid;
    username = req.body.name;

    var id;


    if (userid != null) {
        connection.query('SELECT id  FROM users WHERE subscriber_id=? ', [userid], function(error, results, fields) {

            if (error) {
                res.json({
                    status: 0,

                    message: 'fetching failed',

                })
            } else {
                if (results.length > 0) {
                    id = results[0].id;

                    connection.query('SELECT * FROM subscription WHERE user_id=? ', [id], function(error, results, fields) {

                        if (error) {

                            console.log(error);
                        } else {
                            var expirydate = results[0].expiry_date;
                            var packageid = results[0].package_id;
                            // var datetime = new Date();
                            // if(expirydate>datetime)
                            // {

                            // }

                        }
                        connection.query('SELECT * FROM profile_details WHERE user_id=? ', [id], function(error, results, fields) {
                            if (error) {

                                console.log(error);
                            } else {
                                var name = results[0].name;


                            }

                            connection.query('SELECT * FROM package WHERE id=? ', [packageid], function(error, results, fields) {
                                if (error) {

                                    console.log(error);
                                } else {
                                    var packagename = results[0].name;
                                    var packageamount = results[0].fee;


                                }


                                connection.query('SELECT * FROM address WHERE user_id=? ', [id], function(error, results, fields) {
                                    if (error) {

                                        console.log(error);
                                    } else {
                                        var address = results[0].street;



                                    }

                                    var subscriber = {

                                        "sub_id": userid,
                                        "sub_name": name,
                                        "sub_package": packagename,
                                        "sub_packageID": packageid,
                                        "sub_packamount": packageamount,
                                        "location": address,

                                        "expiry_date": expirydate



                                    }

                                    res.json({
                                        status: 1,
                                        subscribers: subscriber,

                                        message: 'fetched successfully',

                                    })
                                });
                            });


                        });



                    });
                } else {
                    res.json({
                        status: 0,

                        message: 'fetching failed',

                    })
                }
            }




        });

        // } else if (username != null) {
        //     connection.query("select user_id from profile_details where name like '%" + username + "%' ", function(error, results, fields) {
        //         if (error) {
        //             res.json({
        //                 status: 0,

        //                 message: 'fetching failed',

        //             })
        //         } else {
        //             id = results;

        //             console.log(id)
        //             connection.query('SELECT * FROM subscription WHERE user_id=? ', [id], function(error, results, fields) {

        //                 if (error) {
        //                     throw error;

        //                 } else {
        //                     // console.log(results)
        //                     var expirydate = results[0].expiry_date;
        //                     var packageid = results[0].package_id;

        //                 }
        //                 connection.query('SELECT * FROM profile_details WHERE name=? ', [username], function(error, results, fields) {
        //                     if (error) {
        //                         throw error;
        //                         console.log(error);
        //                     } else {
        //                         var name = results[0].name;
        //                         // console.log(results);

        //                     }

        //                     connection.query('SELECT * FROM package WHERE id=? ', [packageid], function(error, results, fields) {
        //                         if (error) {

        //                             console.log(error);
        //                         } else {
        //                             var packagename = results[0].name;
        //                             var packageamount = results[0].fee;


        //                         }


        //                         connection.query('SELECT * FROM address WHERE user_id=? ', [id], function(error, results, fields) {
        //                             if (error) {

        //                                 console.log(error);
        //                             } else {
        //                                 var address = results[0].street;



        //                             }

        //                             var subscriber = {

        //                                 "sub_id": userid,
        //                                 "sub_name": name,
        //                                 "sub_package": packagename,
        //                                 "sub_packageID": packageid,
        //                                 "sub_packamount": packageamount,
        //                                 "location": address,

        //                                 "expiry_date": expirydate



        //                             }

        //                             res.json({
        //                                 status: 1,
        //                                 subscribers: subscriber,

        //                                 message: 'fetched successfully',

        //                             })
        //                         });
        //                     });


        //                 });



        //             });
        //         }




        //     });
    }

});



module.exports = router;