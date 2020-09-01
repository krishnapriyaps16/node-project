const express = require("express");
const router = express.Router();
var connection = require('../config');
router.post('/getDetails', function(req, res) {
    user_id = req.body.user_id;

    connection.query('select id from users where agent_id=?', [user_id], function(error, results, fields) {

        var id = results[0].id

        var query = "SELECT count(s.user_id) as totalSubscribed FROM subscription s inner join users u on s.user_id=u.id  WHERE  u.registered_by='" + id + "';select sum(amount) as amountreceived from collection_details where agent_id='" + id + "';select count(s.user_id) as expiringusers from subscription s inner join users u on s.user_id=u.id where expiry_date between curdate() and DATE_ADD(curdate(), INTERVAL 60 DAY) and u.registered_by='" + id + "';select count(s.user_id) as inactiveusers from subscription s inner join users u on s.user_id=u.id where expiry_date <= curdate() and u.registered_by='" + id + "'";
        //    
        connection.query(query, function(error, results, fields) {
            if (error) {
                console.log(error)
                res.json({
                    status: false,
                    message: 'there are some error with query'
                })

            } else {
                console.log(results);
                if (results.length > 0) {

                    subscribed_result = 1;
                    totalSubscribed = results[0][0].totalSubscribed;
                    //console.log(results[0].totalSubscribed);
                    amountreceived = results[1][0].amountreceived;
                    expiringusers = results[2][0].expiringusers;
                    inactiveusers = results[3][0].inactiveusers;
                    var count = {
                        "totalSubscribed": totalSubscribed,
                        "inactiveusers": inactiveusers,
                        "amountreceived": amountreceived,
                        "expiringusers": expiringusers
                    }

                    res.json({
                        status: 1,
                        message: 'details retreived successfully',
                        count: count

                    });
                } else {
                    res.json({
                        status: 0,
                        message: "Failed to retreive details"
                    });


                }

            }
            res.end();

        });

        // if(subscribed_result=1)
        // { res.json({
        //         status: true,
        //         totalSubscribed: totalSubscribed,
        //         message: 'successfully retreived',

        //     });

        // }
    });

});
router.post('/renewalList', function(req, res) {
    user_id = req.body.user_id;
    var registered_by;

    connection.query('select id from users where agent_id=?', [user_id], function(error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with first query'
            })

        } else {

            if (results.length > 0) {
                registered_by = results[0].id;

                var query = "select distinct u.subscriber_id as sub_id,pd.name as sub_name,s.package_id as sub_packageID,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,p.name as sub_package,p.fee as sub_packamount,(case when s.expiry_date<=curdate() then 1 else 0 end) as expiry_status,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id where u.registered_by='" + registered_by + "' and s.expiry_date between curdate() and DATE_ADD( curdate(), INTERVAL 60 DAY)";

                connection.query(query, function(error, results, fields) {
                    if (error) {
                        res.json({
                            status: 0,
                            message: 'there are some error with query'
                        })

                    } else {

                        if (results.length > 0) {
                            var location = [];
                            var subscribers = [];
                            for (i = 0; i < results.length; i++) {
                                location[i] = {
                                    "housename": results[i].housename,
                                    "street": results[i].street,
                                    "district": results[i].district,
                                    "country": results[i].country,
                                    "state": results[i].state
                                }
                                subscribers[i] = {
                                    "sub_id": results[i].sub_id,
                                    "sub_name": results[i].sub_name,
                                    "sub_package": results[i].sub_package,
                                    "sub_packageID": results[i].sub_packageID,
                                    "sub_packamount": results[i].sub_packamount,
                                    "expiry_date": results[i].expiry_date,
                                    "expiry_status": results[i].expiry_status,
                                    "location": location[i]
                                }

                            }

                            res.json({
                                status: 1,
                                message: 'renewal list retreived successfully',
                                subscribers: subscribers

                            });
                        } else {
                            res.json({
                                status: 0,
                                message: "Failed to retreive renewal list"
                            });


                        }

                    }
                    res.end();

                });
            }
        }

    });


});



router.post('/subscriberdashboard', function(req, res) {
    user_id = req.body.user_id;
    var query = "SELECT distinct br.id as volume_id,br.volume as volume_name,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,case when s.expiry_date<=curdate() then 1 else 0 end as expiry_status,case when br.release_date is null then '' else  DATE_FORMAT(br.release_date, '%d/%m/%Y') end  as volume_releasedon ,br.thumpnail as volume_thumpnail,br.attachment as volume_pdfurl,p.id as pack_id,p.name as pack_name,p.fee as package_amount,pd.name,pd.gender   FROM books_release br inner join books b on br.book_id=b.id inner join package_books pb on pb.book_id=b.id inner join subscription s on s.package_id=pb.package_id inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id where u.subscriber_id='" + user_id + "' and date(br.release_date) between date(s.paid_on) and date(s.expiry_date)";
    connection.query(query, function(error, results, fields) {
        console.log(results)
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with query'
            })
            console.log(error)

        } else {
            var volumes = [];
            var pack_details = [];

            console.log(results)
            if (results.length > 0) {




                for (i = 0; i < results.length; i++) {



                    volumes[i] = {
                        "volume_id": results[i].volume_id,
                        "volume_name": results[i].volume_name,
                        "volume_releasedon": results[i].volume_releasedon,
                        "volume_thumpnail": results[i].volume_thumpnail,
                        "volume_pdfurl": results[i].volume_pdfurl,
                    }

                }

                pack_details = {
                    "pack_name": results[0].pack_name,
                    "pack_id": results[0].pack_id,
                    "pack_amount": results[0].package_amount,
                    "expiry_date": results[0].expiry_date,
                    "expiry_status": results[0].expiry_status,
                }
                var profile_details = {
                    "userid": user_id,
                    "name": results[0].name,
                    "gender": results[0].gender,

                }
                res.json({
                    status: 1,
                    message: 'Details retreived successfully',
                    pack_details: pack_details,
                    profile_details: profile_details,
                    volumes: volumes

                })
            } else {
                res.json({
                    status: 0,
                    message: "Failed to retreive Details"
                });
            }


        }
        res.end();



    });

});


router.get('/admindashboaddetails', function(req, res) {



    var query = "SELECT count(subscriber_id) as totalSubscribed FROM users ;select sum(amount) as amountreceived from collection_details ;select count(s.user_id) as inactiveusers from subscription s inner join users u on s.user_id=u.id where expiry_date <= curdate();SELECT count(agent_id) as totalagent FROM users ";

    connection.query(query, function(error, results, fields) {
        if (error) {
            console.log(error)
            res.json({
                status: false,
                message: 'there are some error with query'
            })

        } else {
            console.log(results);
            if (results.length > 0) {

                subscribed_result = 1;
                totalSubscribed = results[0][0].totalSubscribed;
                //console.log(results[0].totalSubscribed);
                amountreceived = results[1][0].amountreceived;
                inactiveusers = results[2][0].inactiveusers;
                totalagent = results[3][0].totalagent;
                var count = {
                    "totalSubscribed": totalSubscribed,
                    "inactiveusers": inactiveusers,
                    "amountreceived": amountreceived,
                    "totalagent": totalagent
                }

                res.json({
                    status: 1,
                    message: 'details retreived successfully',
                    count: count

                });
            } else {
                res.json({
                    status: 0,
                    message: "Failed to retreive details"
                });


            }

        }
        res.end();

    });



});

router.get('/subscriberlistadmin', function(req, res) {

    var query = "select u.subscriber_id as sub_id ,pd.name as sub_name,s.package_id as sub_packageID,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,case when s.expiry_date<=curdate() then 1 else 0 end as expiry_status,p.name as sub_package,p.fee as sub_packamount,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id order by expiry_date desc limit 10";

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
router.get('/chartDetails', function(req, res) {



    var query = "select count(s.paid_on) as sub_count,year(s.paid_on) as sub_year from subscription s inner join package p on p.id=s.package_id where year(s.paid_on)>year(CURRENT_DATE)-5 and p.is_abroad=0 group by year(s.paid_on);select count(s.paid_on) as sub_count,year(s.paid_on) as sub_year from subscription s inner join package p on p.id=s.package_id where year(s.paid_on)>year(CURRENT_DATE)-5 and p.is_abroad=1 group by year(s.paid_on); ";

    connection.query(query, function(error, results, fields) {
        if (error) {
            console.log(error)
            res.json({
                status: false,
                message: 'there are some error with query'
            })

        } else {
            
            if (results.length > 0) {
              
                // abroadSubscribedCount = results[0][0].sub_count;
                // abroadSubscribedYear = results[0][0].sub_year;
                // indianSubscribedCount = results[1][0].sub_count;
                // indianSubscribedYear = results[1][0].sub_year;
                var abroadSubscribedCount = [];
                var abroadSubscribedYear = [];
                abroadSubscribedDetails= results[0];
              
                for(var i=0; i<abroadSubscribedDetails.length; i++){
                    
                    abroadSubscribedCount.push(abroadSubscribedDetails[i].sub_count);
                    abroadSubscribedYear.push(abroadSubscribedDetails[i].sub_year);
                 }
                 var indianSubscribedCount = [];
                 var indianSubscribedYear = [];
                
                 indianSubscribedDetails= results[1];
                 for(var i=0; i<indianSubscribedDetails.length; i++){
                     
                    indianSubscribedCount.push(indianSubscribedDetails[i].sub_count);
                    indianSubscribedYear.push(indianSubscribedDetails[i].sub_year);
                  }
                // var chartData = {
                //     "abroadSubscribedCount": abroadSubscribedCount,
                //     "abroadSubscribedYear": abroadSubsribedYear,
                //     "indianSubscribedCount": indianSubscribedCount,
                //     "indianSubscribedYear": indianSubscribedYear,


                // }

                res.json({
                    status: 1,
                    message: 'details retreived successfully',
                    abroadSubscribedCount: abroadSubscribedCount,
                    abroadSubscribedYear:abroadSubscribedYear,
                    indianSubscribedCount: indianSubscribedCount,
                    indianSubscribedYear:indianSubscribedYear
                    

                });
            } else {
                res.json({
                    status: 0,
                    message: "Failed to retreive details"
                });


            }

        }
        res.end();

    });



});

module.exports = router;