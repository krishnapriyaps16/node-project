const express = require("express");
const router = express.Router();
var connection = require('../config');
var filterCondition = "";
var path = require("path");
var filterCondition = "";


router.post('/search', function(req, res) {

    userkey = req.body.search_key;


    var id;




    var query = "select u.subscriber_id as sub_id ,pd.name as sub_name,s.package_id as sub_packageID,p.name as sub_package,p.fee as sub_packamount, case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id in(select u.id  from users u inner join profile_details p on u.id=p.user_id where u.subscriber_id ='" + userkey + "' or p.primary_mobile ='" + userkey + "' or p.email='" + userkey + "')";
    connection.query(query, function(error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with query'
            })

        } else {
            if (results.length > 0) {
                var resultsArray = [];
                for (i = 0; i < results.length; i++) {
                    var location = {
                        "housename": results[i].housename,
                        "street": results[i].street,
                        "district": results[i].district,
                        "country": results[i].country,
                        "state": results[i].state
                    }
                    var subscribers = {
                        "sub_id": results[i].sub_id,
                        "sub_name": results[i].sub_name,
                        "sub_package": results[i].sub_package,
                        "sub_packageID": results[i].sub_packageID,
                        "sub_packamount": results[i].sub_packamount,
                        "expiry_date": results[i].expiry_date,
                        "location": location
                    }

                    resultsArray.push(subscribers);

                }

                var pdf = require("pdf-creator-node");
                var fs = require('fs');

                // Read HTML Template
                var html = fs.readFileSync('searchResults.html', 'utf8');
                var options = {
                    format: "A3",
                    orientation: "portrait",
                    border: "10mm",
                    header: {
                        height: "45mm",
                        contents: '<div style="text-align: center;">Subscribers List</div>'
                    },
                    "footer": {
                        "height": "28mm",
                        "contents": {
                            first: 'Cover page',
                            2: 'Second page', // Any page number is working. 1-based index
                            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                            last: 'Last Page'
                        }
                    }

                }
                var pdfPath;
                var document = {
                    html: html,
                    data: {
                        users: resultsArray
                    },
                    path: "./searchResults/subscriberDetails_" + userkey + ".pdf"
                };
                pdfPath = path.basename(document.path);
                pdf.create(document, options)
                    .then(res => {
                        console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                    });
                res.json({
                    status: 1,
                    message: 'fetched successfully',
                    subscribers: resultsArray,
                    searchResultsPath: pdfPath
                });
            } else {
                res.json({
                    status: 0,
                    message: "Failed to fetch "
                });


            }

        }
        res.end();

    });
    // });







    //} else if (username != null) {


    // var query = "select u.subscriber_id as sub_id ,pd.name as sub_name,s.package_id as sub_packageID,s.expiry_date,p.name as sub_package,p.fee as sub_packamount,s.expiry_date,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id in(select user_id from profile_details where name='" + username + "')";

    // connection.query(query, function(error, results, fields) {
    //     if (error) {
    //         res.json({
    //             status: false,
    //             message: 'there are some error with query'
    //         })

    //     } else {
    //         if (results.length > 0) {
    //             var resultsArray = [];
    //             for (i = 0; i < results.length; i++) {
    //                 var location = {
    //                     "housename": results[i].housename,
    //                     "street": results[i].street,
    //                     "district": results[i].district,
    //                     "country": results[i].country,
    //                     "state": results[i].state
    //                 }
    //                 var subscribers = {
    //                     "sub_id": results[i].sub_id,
    //                     "sub_name": results[i].sub_name,
    //                     "sub_package": results[i].sub_package,
    //                     "sub_packageID": results[i].sub_packageID,
    //                     "sub_packamount": results[i].sub_packamount,
    //                     "expiry_date": results[i].expiry_date,
    //                     "location": location
    //                 }

    //                 resultsArray.push(subscribers);
    //             }


    //             res.json({
    //                 status: 1,
    //                 message: 'fetched successfully',
    //                 subscribers: resultsArray

    //             });
    //         } else {
    //             res.json({
    //                 status: false,
    //                 message: "Failed to fetch "
    //             });


    //         }

    //     }
    //     res.end();

    // });



    //}

});
router.post('/SubscriberPackList', function(req, res) {

    user_id = req.body.user_id;
    var query = "select s.package_id,p.name as package_name,p.fee as package_amount,case when s.paid_on is null then '' else  DATE_FORMAT(s.paid_on, '%d/%m/%Y') end  as subscribedon_date,p.package_status from subscription s inner join package p on s.package_id=p.id where s.user_id=" + user_id + "";
    //    
    connection.query(query, function(error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with query'
            })

        } else {
            if (results.length > 0) {

                var subscribed_packs = {
                    "package_id": results[0].package_id,
                    "package_name": results[0].package_name,
                    "package_amount": results[0].package_amount,
                    "subscribedon_date": results[0].subscribedon_date,
                    "package_status": results[0].package_status,
                }

                res.json({
                    status: 1,
                    message: 'Packages retreived successfully',
                    subscribed_packs: subscribed_packs

                });
            } else {
                res.json({
                    status: false,
                    message: "Failed to retreive packages"
                });


            }

        }
        res.end();

    });



});

router.post('/subscriberdetails', function(req, res) {

    userid = req.body.userid;



    var query = "select u.subscriber_id as sub_id,pd.name as name,pd.email as email,pd.primary_mobile as mobile,case when pd.alternate_mobile is null then '' else pd.alternate_mobile end as whatsup_number,pd.landline_number as landline_number, pd.name as sub_name,s.package_id as sub_packageID,case when s.paid_on is null then '' else  DATE_FORMAT(s.paid_on, '%d/%m/%Y') end as paid_ondate,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,p.name as sub_package,p.fee as sub_packamount,a.housename,a.street,a.district,a.pincode,c.name as country,st.name as state,(case when s.expiry_date<=curdate() then 1 else 0 end) as expiry_status from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id in(select id from users where subscriber_id='" + userid + "')";

    connection.query(query, function(error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with query'
            })


        } else {
            if (results.length > 0) {
                // var resultsArray = [];
                // for (i = 0; i < results.length; i++) {
                var location = {
                    "housename": results[0].housename,
                    "street": results[0].street,
                    "district": results[0].district,
                    "country": results[0].country,
                    "state": results[0].state,
                    "pincode": results[0].pincode
                }

                var subscribers = {
                    "sub_id": results[0].sub_id,
                    "sub_name": results[0].sub_name,
                    "sub_package": results[0].sub_package,
                    "sub_packageID": results[0].sub_packageID,
                    "sub_packamount": results[0].sub_packamount,
                    "expiry_date": results[0].expiry_date,
                    "expiry_status": results[0].expiry_status,
                    "paid_on": results[0].paid_ondate,
                    "location": location

                }

                var profile_data = {

                    "name": results[0].name,
                    "Mobile": results[0].mobile,
                    "whatsup_number": results[0].whatsup_number,
                    "landline_number": results[0].landline_number,
                    "Email": results[0].email

                }




                // resultsArray.push(subscribers);

                // }

                res.json({
                    status: 1,
                    message: 'fetched successfully',
                    subscribers: subscribers,
                    profile_data: profile_data


                });
            } else {
                res.json({
                    status: 0,
                    message: "Failed to fetch "
                });


            }

        }
        res.end();

    });


});




router.post('/subscriberprofile', function(req, res) {
    token = req.body.token
    console.log(token)
    connection.query('SELECT id ,subscriber_id FROM users WHERE token=? ', [token], function(error, results, fields) {


        if (results.length > 0) {
            var id = results[0].id;
            var subscriberid = results[0].subscriber_id;
            console.log(results)

            var query = "select u.subscriber_id as sub_id,pd.name as name,pd.job_title as job_title,pd.company_name as company_name,pd.company_address as company_address,pd.landline_number as landline_number,pd.email as email,pd.primary_mobile as mobile,pd.currently_employed as currently_employed,pd.basic_education as basic_education,pd.gender as gender,DATE_FORMAT(pd.dob, '%d/%m/%Y') as dob,case when pd.alternate_mobile is null then '' else pd.alternate_mobile end as whatsup_number,pd.name as sub_name,s.package_id as sub_packageID,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,p.name as sub_package,p.fee as sub_packamount,a.housename,a.street,a.district,a.pincode,c.name as country,c.id as country_id,st.name as state,st.id as state_id from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id ='" + id + "'";

            connection.query(query, function(error, results, fields) {
                if (error) {
                    res.json({
                        status: 0,
                        message: 'there are some error with query'
                    })

                } else {
                    if (results.length > 0) {
                        //var resultsArray = [];
                        // for (i = 0; i < results.length; i++) {
                        var location = {
                            "housename": results[0].housename,
                            "street": results[0].street,
                            "district": results[0].district,
                            "country": results[0].country,
                            "country_id": results[0].country_id,
                            "state": results[0].state,
                            "state_id": results[0].state_id,
                            "pincode": results[0].pincode
                        }
                        var job_details = {
                            "job_title": results[0].job_title,
                            "company_name": results[0].company_name,
                            "company_address": results[0].company_address,
                        }

                        var profile_data = {
                            "subscriber_id": results[0].sub_id,
                            "name": results[0].name,
                            "Mobile": results[0].mobile,
                            "Whatsup_number": results[0].whatsup_number,
                            "landline_number":results[0].landline_number,
                            "Basic_education": results[0].basic_education,
                            "Dob": results[0].dob,
                            "gender": results[0].gender,
                            "currently_employed": results[0].currently_employed,
                            "Email": results[0].email,
                            "location": location,
                            "job_details": job_details

                        }




                        // resultsArray.push(subscribers);

                        // }

                        res.json({
                            status: 1,
                            message: 'fetched successfully',
                            subscribers: profile_data


                        });
                    } else {
                        res.json({
                            status: 0,
                            message: "Failed to fetch "
                        });


                    }

                }


            });


            // connection.query('SELECT name,primary_mobile,email  FROM profile_details WHERE user_id=? ', [id], function(error, results, fields) {
            //     var profilename = results[0].name;
            //     var mobile = results[0].primary_mobile;
            //     var email = results[0].email;
            //     // console.log(results)
            //     connection.query('SELECT housename,street,district,state_id,country_id  FROM address WHERE user_id=? ', [id], function(error, results, fields) {
            //         var housename = results[0].housename;
            //         var street = results[0].street;
            //         var district = results[0].district;
            //         var stateid = results[0].state_id;
            //         console.log(results)
            //         var countryid = results[0].country_id;



            //         connection.query('SELECT name FROM countries WHERE id=?', [countryid], function(error, results, fields) {


            //             var countryname = results[0].name;

            //             // console.log(countryname)
            //             connection.query('SELECT name FROM states WHERE id=? ', [stateid], function(error, results, fields) {
            //                 var statename = results[0].name;

            //                 // connection.query('SELECT name FROM districts WHERE id=? ', [districtid], function(error, results, fields) {
            //                 //     var districtname = results[0].name;

            //                 var addressdata = {
            //                     "housename": housename,
            //                     "street": street,
            //                     "country": countryname,
            //                     "state": statename,
            //                     "district": district,
            //                 }
            //                 var profile_data = {
            //                     "name": profilename,
            //                     "subscriber_ID": subscriberid,
            //                     "email": email,
            //                     "mobile": mobile
            //                 }

            //                 res.json({
            //                         status: 1,
            //                         profile_data: profile_data,
            //                         address_data: addressdata,
            //                         message: 'Profile Fetched successfully',

            //                     })
            //                     // });
            //             });
            //         });
            //     });

            // });
        } else {
            res.json({
                status: 0,
                message: " Invalid data"
            });
        }



    });
});



router.post('/subscriberedit', function(req, res) {
    userid = req.body.userid;
    var subscribername = req.body.name;
    var email = req.body.email;
    var mobile = req.body.primary_mobile;
    var whatsup_number = req.body.whatsup_number;
    var housename = req.body.housename;
    var street = req.body.street;
    var basic_education = req.body.basic_education;
    var currently_employed = req.body.currently_employed;
    var countryid = req.body.country_id;
    var stateid = req.body.state_id;
    var district = req.body.district;
    var job_title = req.body.job_title;
    var company_name = req.body.company_name;
    var company_address = req.body.company_address;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var pincode = req.body.pincode;
    var landline_number = req.body.landline_number;

    connection.query('SELECT id  FROM users WHERE subscriber_id=? ', [userid], function(error, results, fields) {
        if (results.length > 0) {
            var id = results[0].id


            connection.beginTransaction(function(err) {
                if (err) {
                    console.log(err);
                    res.json({
                        status: 0,
                        message: "updation failed"
                    });

                }



                connection.query("update  profile_details set name='" + subscribername + "' , primary_mobile='" + mobile + "' ,alternate_mobile='" + whatsup_number + "', landline_number='"+landline_number+"',email='" + email + "' ,job_title='" + job_title + "',company_name='" + company_name + "',company_address='" + company_address + "',basic_education='" + basic_education + "',gender='" + gender + "',currently_employed='" + currently_employed + "',dob=STR_TO_DATE('" + dob + "', '%Y-%m-%d') where user_id='" + id + "'", function(err, result) {
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                    }

                    connection.query('update  address SET housename=? , street=? , district=? , state_id=?,pincode=? , country_id=? where user_id=?  ', [housename, street, district, stateid, pincode, countryid, id], function(err, result) {
                        if (err) {
                            connection.rollback(function() {
                                throw err;
                            });
                        }



                        connection.commit(function(err) {
                            if (err) {
                                console.log(err);
                                res.json({
                                    status: 0,
                                    message: "updation failed"
                                });

                                connection.rollback(function() {

                                    throw err;
                                });
                            } else {
                                res.json({
                                    status: 1,
                                    message: " updated sucessfully"
                                });

                            }
                            console.log('Transaction Complete.');
                            //connection.end();
                        });


                    });


                });

            });
        } else {
            res.json({

                status: 0,
                message: "updation failed"
            });
        }
    });


});


router.post('/subscriberlist', function(req, res) {


    userid = req.body.user_id;

    connection.query('SELECT id  FROM users WHERE agent_id=? ', [userid], function(error, results, fields) {

        var id = results[0].id

        var query = "select u.subscriber_id as sub_id ,pd.name as sub_name,s.package_id as sub_packageID,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,case when s.expiry_date<=curdate() then 1 else 0 end as expiry_status,p.name as sub_package,p.fee as sub_packamount,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s left join package p on s.package_id=p.id left join users u on s.user_id=u.id left join profile_details pd on pd.user_id=u.id left join address a on a.user_id=u.id left join countries c on c.id=a.country_id left join states st on st.id=a.state_id  where u.id in(SELECT id from users where registered_by='" + id + "' AND user_type_id=2) and s.payment_done=1";

        connection.query(query, function(error, results, fields) {
            if (error) {
                res.json({
                    status: false,
                    message: 'there are some error with query'
                })

            } else {
                if (results.length > 0) {
                    var resultsArray = [];
                    for (i = 0; i < results.length; i++) {
                        var location = {
                            "housename": results[i].housename,
                            "street": results[i].street,
                            "district": results[i].district,
                            "country": results[i].country,
                            "state": results[i].state
                        }
                        var subscribers = {
                            "sub_id": results[i].sub_id,
                            "sub_name": results[i].sub_name,
                            "sub_package": results[i].sub_package,
                            "sub_packageID": results[i].sub_packageID,
                            "sub_packamount": results[i].sub_packamount,
                            "expiry_date": results[i].expiry_date,
                            "expiry_status": results[i].expiry_status,
                            "location": location
                        }

                        resultsArray.push(subscribers);
                    }


                    res.json({
                        status: 1,
                        message: 'fetched successfully',
                        subscribers: resultsArray

                    });
                } else {
                    res.json({
                        status: 0,
                        message: "Failed to fetch list"
                    });


                }

            }


        });
    });


});


router.post('/searchfilter', function(req, res) {


    agent_id = req.body.user_id;
    package_id = req.body.package_id;
    from_date = req.body.from_date;
    to_date = req.body.to_date;
    // from_date = STR_TO_DATE(req.body.from_date, '%Y-%m-%d');
    // to_date = STR_TO_DATE(req.body.to_date, '%Y-%m-%d');


    connection.query('SELECT id  FROM users WHERE agent_id=? ', [agent_id], function(error, results, fields) {

        var id = results[0].id

        if (agent_id != null) {


            var query = "select u.subscriber_id as sub_id ,pd.name as sub_name,s.package_id as sub_packageID,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,p.name as sub_package,p.fee as sub_packamount,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id in(select id from users where registered_by='" + id + "')";
            if (from_date != null && to_date != null) {
                var query = "select u.subscriber_id as sub_id ,pd.name as sub_name,s.package_id as sub_packageID,p.name as sub_package,p.fee as sub_packamount,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id in(select u.id  from users u inner join subscription s on u.id=s.user_id where  u.registered_by='" + id + "' and  s.paid_on  BETWEEN STR_TO_DATE('" + from_date + "', '%Y-%m-%d') AND STR_TO_DATE('" + to_date + "', '%Y-%m-%d'))";
            }

            if (package_id != null) {
                var query = "select u.subscriber_id as sub_id ,pd.name as sub_name,s.package_id as sub_packageID,p.name as sub_package,p.fee as sub_packamount,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id in(select u.id  from users u inner join subscription s on u.id=s.user_id where u.registered_by='" + id + "' and s.package_id='" + package_id + "' )";


                if (from_date != null && to_date != null) {
                    var query = "select u.subscriber_id as sub_id ,pd.name as sub_name,s.package_id as sub_packageID,p.name as sub_package,p.fee as sub_packamount,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id in(select u.id  from users u inner join subscription s on u.id=s.user_id where  u.registered_by='" + id + "' and s.package_id='" + package_id + "'and s.paid_on  BETWEEN STR_TO_DATE('" + from_date + "', '%Y-%m-%d') AND STR_TO_DATE('" + to_date + "', '%Y-%m-%d'))";
                }
            }



        }

        connection.query(query, function(error, results, fields) {
            if (error) {
                res.json({
                    status: 0,
                    message: 'there are some error with query'
                })

            } else {
                if (results.length > 0) {
                    var resultsArray = [];
                    for (i = 0; i < results.length; i++) {
                        var location = {
                            "housename": results[i].housename,
                            "street": results[i].street,
                            "district": results[i].district,
                            "country": results[i].country,
                            "state": results[i].state
                        }
                        var subscribers = {
                            "sub_id": results[i].sub_id,
                            "sub_name": results[i].sub_name,
                            "sub_package": results[i].sub_package,
                            "sub_packageID": results[i].sub_packageID,
                            "sub_packamount": results[i].sub_packamount,
                            "expiry_date": results[i].expiry_date,
                            "location": location
                        }

                        resultsArray.push(subscribers);

                    }
                    var pdf = require("pdf-creator-node");
                    var fs = require('fs');

                    // Read HTML Template
                    var html = fs.readFileSync('searchResults.html', 'utf8');
                    var options = {
                        format: "A3",
                        orientation: "portrait",
                        border: "10mm",
                        header: {
                            height: "45mm",
                            contents: '<div style="text-align: center;">Subscribers List</div>'
                        },
                        "footer": {
                            "height": "28mm",
                            "contents": {
                                first: 'Cover page',
                                2: 'Second page', // Any page number is working. 1-based index
                                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                                last: 'Last Page'
                            }
                        }

                    }
                    var pdfPath;
                    var document = {
                        html: html,
                        data: {
                            users: resultsArray
                        },
                        path: "./searchResults/subscriberDetails_" + agent_id + ".pdf"
                    };
                    pdfPath = "http://52.55.205.218:5555/" + path.basename(document.path);
                    pdf.create(document, options)
                        .then(res => {
                            console.log(res)
                        })
                        .catch(error => {
                            console.error(error)
                        });
                    res.json({
                        status: 1,
                        message: 'fetched successfully',
                        subscribers: resultsArray,
                        searchResultsPath: pdfPath
                    });
                } else {
                    res.json({
                        status: 0,
                        message: "Failed to fetch "
                    });


                }

            }


        });
    });




});

router.post('/reportResults', function(req, res) {

    if (req.body.is_abroad == true)
        is_abroad = 1
    else
        is_abroad = 0
        //is_abroad = req.body.is_abroad;
    package_id = req.body.package_id;
    start_date = req.body.start_date;
    end_date = req.body.end_date;
    is_active = req.body.is_active;
    country_id = req.body.country_id;
    state_id = req.body.state_id;
    filterCondition = "";
    if (is_abroad != "") {
        if (filterCondition == "")
            filterCondition = ' where p.is_abroad=' + is_abroad;
        else
            filterCondition = filterCondition + ' where p.is_abroad=' + is_abroad;
    }
    if (package_id != "") {
        if(package_id==0)
        {
            if (filterCondition == "")
            filterCondition = ' where p.id<>' + package_id;
            else
            filterCondition = filterCondition + ' and p.id<>' + package_id;
        }
        else
        {
            if (filterCondition == "")
            filterCondition = ' where p.id=' + package_id;
            else
            filterCondition = filterCondition + ' and p.id=' + package_id;
        }
       
    }
    if (start_date != "" && end_date != "") {
        if (filterCondition == "")
            filterCondition = "where s.paid_on between '" + start_date + "' and '" + end_date + "'";
        else
            filterCondition = filterCondition + " and s.paid_on between '" + start_date + "' and '" + end_date + "'";
    }

    if (is_active != "") {
        if (filterCondition == "")
            filterCondition = ' where s.expiry_date<=curdate()';
        else
            filterCondition = filterCondition + ' and s.expiry_date<=curdate()';
    }
    if (country_id != "") {
        if(country_id==0)
        {
            if (filterCondition == "")
            filterCondition = ' where a.country_id<>' + country_id;
            else
            filterCondition = filterCondition + ' and a.country_id<>' + country_id;
        }
        else
        {
            if (filterCondition == "")
                filterCondition = ' where a.country_id=' + country_id;
            else
                filterCondition = filterCondition + ' and a.country_id=' + country_id;
         }
    }
    if (state_id != "") {
        if(state_id==0)
        {
            if (filterCondition == "")
            filterCondition = ' where a.state_id<>' + state_id;
            else
            filterCondition = filterCondition + ' and a.state_id<>' + state_id;
        }
        else
        {
            if (filterCondition == "")
                filterCondition = ' where a.state_id=' + state_id;
            else
                filterCondition = filterCondition + ' and a.state_id=' + state_id;
        }
    }
    var query = "select u.subscriber_id as sub_id ,pd.name as sub_name,s.package_id as sub_packageID,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,p.name as sub_package,p.fee as sub_packamount,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id" + filterCondition;
    connection.query(query, function(error, results, fields) {
        if (error) {
            res.json({
                status: 0,
                message: 'there are some error with query'
            })

        } else {
            var resultsArray = [];
            if (results.length > 0) {

                for (i = 0; i < results.length; i++) {
                    var location = {
                        "housename": results[i].housename,
                        "street": results[i].street,
                        "district": results[i].district,
                        "country": results[i].country,
                        "state": results[i].state
                    }
                    var subscribers = {
                        "sub_id": results[i].sub_id,
                        "sub_name": results[i].sub_name,
                        "sub_package": results[i].sub_package,
                        "sub_packageID": results[i].sub_packageID,
                        "sub_packamount": results[i].sub_packamount,
                        "expiry_date": results[i].expiry_date,
                        "location": location
                    }

                    resultsArray.push(subscribers);

                }

                res.json({
                    status: 1,
                    message: 'fetched successfully',
                    subscribers: resultsArray


                });
            } else {
                res.json({
                    status: 0,
                    message: "Failed to fetch "
                });


            }

        }

    });
    // });




});
router.post('/expirydetails', function(req, res) {

    userid = req.body.userid;



    var query = "select u.subscriber_id as sub_id,pd.name as name,pd.email as email,pd.primary_mobile as mobile,case when pd.alternate_mobile is null then '' else pd.alternate_mobile end as whatsup_number,pd.name as sub_name,s.package_id as sub_packageID,case when s.paid_on is null then '' else  DATE_FORMAT(s.paid_on, '%d/%m/%Y') end as paid_ondate,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,p.name as sub_package,p.fee as sub_packamount,a.housename,a.street,a.district,a.pincode,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id in(select id from users where subscriber_id='" + userid + "')";

    connection.query(query, function(error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with query'
            })


        } else {
            if (results.length > 0) {
                // var resultsArray = [];
                // for (i = 0; i < results.length; i++) {
                var location = {
                    "housename": results[0].housename,
                    "street": results[0].street,
                    "district": results[0].district,
                    "country": results[0].country,
                    "state": results[0].state,
                    "pincode": results[0].pincode
                }

                var subscribers = {
                    "sub_id": results[0].sub_id,
                    "sub_name": results[0].sub_name,
                    "sub_package": results[0].sub_package,
                    "sub_packageID": results[0].sub_packageID,
                    "sub_packamount": results[0].sub_packamount,
                    "expiry_date": results[0].expiry_date,
                    "paid_on": results[0].paid_ondate,
                    "location": location

                }

                var profile_data = {

                    "name": results[0].name,
                    "Mobile": results[0].mobile,
                    "whatsup_number": results[0].whatsup_number,
                    "Email": results[0].email

                }




                // resultsArray.push(subscribers);

                // }

                res.json({
                    status: 1,
                    message: 'fetched successfully',
                    subscribers: subscribers,
                    profile_data: profile_data


                });
            } else {
                res.json({
                    status: 0,
                    message: "Failed to fetch "
                });


            }

        }
        res.end();

    });


});
module.exports = router;