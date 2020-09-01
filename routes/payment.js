const express = require("express");
const router = express.Router();
var connection = require('../config');
router.post('/recordPayment', function(req, res) {

    coll_mode_id = req.body.coll_mode_id;
    cheque_dd_no = req.body.cheque_dd_no;
    amount = req.body.amount;
    collected_date = req.body.collected_date;
    agent_unq_id = req.body.agent_id;
    sub_unq_id = req.body.user_id;
    package_id = req.body.package_id;
    var query = "select no_of_months from package where id='" + package_id + "' ";
    connection.query(query, function(error, results, fields) {

        if (error) {
            console.log(error);
            res.json({
                status: 0,
                message: 'there are some error with first query'
            })

        } else {
            var no_of_months = results[0].no_of_months;
            if (req.body.agent_id != null) {
                var query = "select id from users  where agent_id='" + agent_unq_id + "';select id from users where subscriber_id='" + sub_unq_id + "' ";
                connection.query(query, function(error, results, fields) {

                    if (error) {
                        console.log(error);
                        res.json({
                            status: 0,
                            message: 'there are some error with first query'
                        })

                    } else {
                        var agent_id = results[0][0].id;
                        var user_id = results[1][0].id;
                        connection.query('INSERT INTO collection_details SET collection_mode_id=? , cheque_dd_no=?, amount=?,collected_date=?,agent_id=?,user_id=?,package_id=?', [coll_mode_id, cheque_dd_no, amount, collected_date, agent_id, user_id, package_id], function(error, results, fields) {
                            if (error) {
                                console.log(error);
                                res.json({
                                    status: 0,
                                    message: 'there are some error with first query'
                                })

                            } else {

                                var query = "update subscription set payment_done=1,paid_on='" + collected_date + "',expiry_date=DATE_ADD('" + collected_date + "', INTERVAL '" + no_of_months + " ' month) where user_id='" + user_id + "' ";

                                connection.query(query, function(error, results, fields) {
                                    if (error) {
                                        res.json({
                                            status: 0,
                                            message: 'there are some error with query'
                                        })

                                    } else {

                                        connection.query('insert into payment_history set payment_mode=?,amount=?,payment_date=?,subscriber_id=?,package_id=?', [coll_mode_id, amount, collected_date, user_id, package_id], function(error, results, fields) {
                                            if (error) {
                                                res.json({
                                                    status: 0,
                                                    message: 'there are some error with query'
                                                })

                                            } else {


                                                res.json({
                                                    status: 1,
                                                    message: 'payment history updated successfully',

                                                });


                                            }
                                            res.end();

                                        });

                                        res.json({
                                            status: 1,
                                            message: 'payment recorded successfully',

                                        });


                                        // } else {
                                        //     res.json({
                                        //         status: 0,
                                        //         message: "Failed to record payment"
                                        //     });


                                        // }

                                    }
                                    res.end();

                                });

                            }

                        });

                    }
                });
            } else {
                var query = "select id from users where subscriber_id='" + sub_unq_id + "' ";
                connection.query(query, function(error, results, fields) {

                    if (error) {
                        console.log(error);
                        res.json({
                            status: 0,
                            message: 'there are some error with first query'
                        })

                    } else {


                        var user_id = results[0].id;

                        connection.query("INSERT INTO collection_details SET collection_mode_id=1 , amount='" + amount + "',collected_date=curdate(),user_id='" + user_id + "',package_id='" + package_id + "',agent_id=0", function(error, results, fields) {
                            if (error) {
                                console.log(error);
                                res.json({
                                    status: 0,
                                    message: 'there are some error with first query'
                                })

                            } else {

                                var query = "update subscription set payment_done=1,paid_on=curdate(),expiry_date=DATE_ADD(curdate(), INTERVAL '" + no_of_months + " ' month) where user_id='" + user_id + "' ";

                                connection.query(query, function(error, results, fields) {
                                    if (error) {
                                        res.json({
                                            status: 0,
                                            message: 'there are some error with query'
                                        })

                                    } else {
                                        var query = "insert into payment_history (payment_mode,amount,payment_date,subscriber_id,package_id)values(1,'" + amount + "',curdate(),'" + user_id + "','" + package_id + "')";
                                        connection.query(query, function(error, results, fields) {
                                            if (error) {
                                                res.json({
                                                    status: 0,
                                                    message: 'there are some error with query'
                                                })

                                            } else {


                                                res.json({
                                                    status: 1,
                                                    message: 'payment history updated successfully',

                                                });


                                            }
                                            res.end();

                                        });
                                        res.json({
                                            status: 1,
                                            message: 'payment recorded successfully',

                                        });




                                    }
                                    res.end();

                                });

                            }

                        });

                    }
                });

            }
        }
    });



});
router.post('/renewSubscription', function(req, res) {

    coll_mode_id = req.body.coll_mode_id;
    cheque_dd_no = req.body.cheque_dd_no;
    amount = req.body.amount;
    collected_date = req.body.collected_date;
    agent_unq_id = req.body.agent_id;
    sub_unq_id = req.body.user_id;
    package_id = req.body.package_id;
    package_changed = req.body.package_changed;
    console.log(req.body);
    console.log(req.body.coll_mode_id);
    var query = "select no_of_months from package where id='" + package_id + "' ";
    connection.query(query, function(error, results, fields) {

        if (error) {
            console.log(error);
            res.json({
                status: 0,
                message: 'there are some error with first query'
            })

        } else {
            var no_of_months = results[0].no_of_months;
            console.log(no_of_months)
            if (req.body.agent_id != null) {
                var query = "select id from users  where agent_id='" + agent_unq_id + "';select id from users where subscriber_id='" + sub_unq_id + "' ";
                connection.query(query, function(error, results, fields) {

                    if (error) {
                        console.log(error);
                        res.json({
                            status: 0,
                            message: 'there are some error with first query'
                        })

                    } else {

                        var agent_id = results[0][0].id;
                        var user_id = results[1][0].id;

                        connection.query('INSERT INTO collection_details SET collection_mode_id=? , cheque_dd_no=?, amount=?,collected_date=?,agent_id=?,user_id=?,package_id=?', [coll_mode_id, cheque_dd_no, amount, collected_date, agent_id, user_id, package_id], function(error, results, fields) {
                            if (error) {
                                console.log(error);
                                res.json({
                                    status: 0,
                                    message: 'there are some error with first query'
                                })

                            } else {
                                var query = "update subscription set payment_done=1,package_id='" + package_id + "',paid_on='" + collected_date + "',expiry_date=DATE_ADD('" + collected_date + "', INTERVAL '" + no_of_months + " ' month) where user_id='" + user_id + "' ";
                                // if(package_changed==1)
                                // {
                                //     var query = "insert into subscription (user_id,package_id,payment_mode,payment_done,paid_on,expiry_date)values('"+user_id+"','"+package_id+"','"+coll_mode_id+"',1,'"+collected_date+"',DATE_ADD('"+collected_date+"', INTERVAL "+no_of_months+" month ))";
                                // }
                                // else
                                // {
                                //     var query = "update subscription set payment_done=1,paid_on='"+collected_date+"',expiry_date=DATE_ADD('"+collected_date+"', INTERVAL '"+no_of_months+" ' month) where user_id='" + user_id + "' ";
                                // }
                                connection.query(query, function(error, results, fields) {
                                    if (error) {
                                        res.json({
                                            status: 0,
                                            message: 'there are some error with query'
                                        })

                                    } else {

                                        connection.query('insert into payment_history set payment_mode=?,amount=?,payment_date=?,subscriber_id=?,package_id=?', [coll_mode_id, amount, collected_date, user_id, package_id], function(error, results, fields) {
                                            if (error) {
                                                res.json({
                                                    status: 0,
                                                    message: 'there are some error with query'
                                                })

                                            } else {


                                                res.json({
                                                    status: 1,
                                                    message: 'payment history updated successfully',

                                                });


                                            }
                                            res.end();

                                        });

                                        res.json({
                                            status: 1,
                                            message: 'payment recorded successfully',

                                        });


                                        // } else {
                                        //     res.json({
                                        //         status: 0,
                                        //         message: "Failed to record payment"
                                        //     });


                                        // }

                                    }
                                    res.end();

                                });

                            }

                        });

                    }
                });
            } else {
                var query = "select id from users where subscriber_id='" + sub_unq_id + "' ";
                connection.query(query, function(error, results, fields) {

                    if (error) {
                        console.log(error);
                        res.json({
                            status: 0,
                            message: 'there are some error with first query'
                        })

                    } else {


                        var user_id = results[0].id;

                        connection.query("INSERT INTO collection_details SET collection_mode_id=1 , amount='" + amount + "',collected_date=curdate(),user_id='" + user_id + "',package_id='" + package_id + "',agent_id=0", function(error, results, fields) {
                            if (error) {
                                console.log(error);
                                res.json({
                                    status: 0,
                                    message: 'there are some error with first query'
                                })

                            } else {

                                var query = "update subscription set payment_done=1,package_id='" + package_id + "',paid_on=curdate() where user_id='" + user_id + "' ";

                                connection.query(query, function(error, results, fields) {
                                    if (error) {
                                        res.json({
                                            status: 0,
                                            message: 'there are some error with query'
                                        })

                                    } else {
                                        //         if(package_changed==1)
                                        // {
                                        //     var query = "insert into subscription (user_id,package_id,payment_mode,payment_done,paid_on,expiry_date)values('"+user_id+"','"+package_id+"','"+coll_mode_id+"',1,curdate(),DATE_ADD(curdate(), INTERVAL "+no_of_months+" month ))";
                                        // }
                                        // else
                                        // {
                                        //     var query = "update subscription set payment_done=1,paid_on=curdate(),expiry_date=DATE_ADD(curdate(), INTERVAL '"+no_of_months+" ' month) where user_id='" + user_id + "' ";
                                        // }
                                        var query = "update subscription set payment_done=1,paid_on=curdate(),expiry_date=DATE_ADD(curdate(), INTERVAL '" + no_of_months + " ' month) where user_id='" + user_id + "' ";
                                        connection.query(query, function(error, results, fields) {
                                            if (error) {
                                                res.json({
                                                    status: 0,
                                                    message: 'there are some error with query'
                                                })

                                            } else {
                                                var query = "insert into payment_history (payment_mode,amount,payment_date,subscriber_id,package_id)values(1,'" + amount + "',curdate(),'" + user_id + "','" + package_id + "')";
                                                connection.query(query, function(error, results, fields) {
                                                    if (error) {
                                                        res.json({
                                                            status: 0,
                                                            message: 'there are some error with query'
                                                        })

                                                    } else {


                                                        res.json({
                                                            status: 1,
                                                            message: 'payment history updated successfully',

                                                        });


                                                    }
                                                    res.end();

                                                });
                                            }
                                        });

                                        res.json({
                                            status: 1,
                                            message: 'payment recorded successfully',

                                        });




                                    }
                                    res.end();

                                });

                            }

                        });

                    }
                });

            }
        }

    });



});
router.post('/paymentdues', function(req, res) {

    agent_id = req.body.user_id;
    connection.query('SELECT id  FROM users WHERE agent_id=? ', [agent_id], function(error, results, fields) {

        var id = results[0].id

        if (results.length > 0) {
            var query = "select u.subscriber_id as sub_id ,pd.name as sub_name,s.package_id as sub_packageID,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,p.name as sub_package,p.fee as sub_packamount,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id in(select u.id  from users u inner join subscription s on u.id=s.user_id where u.registered_by='" + id + "' and s.payment_done=0 )";

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
                            message: 'payment dues list retreived successfully',
                            subscribers: subscribers

                        });
                    } else {
                        res.json({
                            status: 0,
                            message: "Failed to retreive payment dues list"
                        });


                    }

                }


            });


        } else {
            res.json({
                status: 0,
                message: "Failed to retreive payment dues list"
            });
        }





    });


});

router.post('/paymentduesdetails', function(req, res) {

    user_id = req.body.user_id;

    try {
        var query = "select u.subscriber_id as sub_id ,pd.name as sub_name,pd.email as email,pd.primary_mobile as mobile,s.package_id as sub_packageID,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,p.name as sub_package,p.fee as sub_packamount,p.package_status as sub_packstatus,case when p.description is null then '' else p.description end as description,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id in(select id from users where subscriber_id='" + user_id + "' )";

        connection.query(query, function(error, results, fields) {
            if (error) {
                console.log(error)
                res.json({
                    status: 0,
                    message: 'there are some error with query'
                })

            } else {

                if (results.length > 0) {
                    var location = [];
                    var subscribers = [];
                    var profile_data = [];
                    //for (i = 0; i < results.length; i++) {
                    location = {
                        "housename": results[0].housename,
                        "street": results[0].street,
                        "district": results[0].district,
                        "country": results[0].country,
                        "state": results[0].state
                    }
                    profile_data = {

                        "Mobile": results[0].mobile,
                        "email": results[0].email
                    }
                    subscribers = {
                        "sub_id": results[0].sub_id,
                        "sub_name": results[0].sub_name,
                        "sub_package": results[0].sub_package,
                        "sub_packageID": results[0].sub_packageID,
                        "sub_packamount": results[0].sub_packamount,
                        "sub_packstatus": results[0].sub_packstatus,
                        "description": results[0].description,
                        "expiry_date": results[0].expiry_date,
                        "expiry_status": results[0].expiry_status,
                        "location": location,
                        "profile_data": profile_data
                    }

                    //}

                    res.json({
                        status: 1,
                        message: 'payment dues detail retreived successfully',
                        subscribers: subscribers

                    });
                } else {
                    res.json({
                        status: 0,
                        message: "Failed to retreive payment dues list"
                    });


                }

            }


        });

    } catch (ex) {
        console.log(ex)
    }






    // });


});


router.post('/inactiveusers', function(req, res) {

    agent_id = req.body.user_id;
    connection.query('select id from users where agent_id=?', [agent_id], function(error, results, fields) {

        registered_by = results[0].id;

        if (results.length > 0) {
            var query = "select u.subscriber_id as sub_id ,pd.name as sub_name,pd.email as email,pd.primary_mobile as mobile,s.package_id as sub_packageID,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,p.name as sub_package,p.fee as sub_packamount,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id in(select u.id  from users u inner join subscription s on u.id=s.user_id where u.registered_by='" + registered_by + "' and  s.expiry_date<=curdate())";

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
                                "location": location[i]
                            }

                        }

                        res.json({
                            status: 1,
                            message: 'inactive users list retreived successfully',
                            subscribers: subscribers

                        });
                    } else {
                        res.json({
                            status: 0,
                            message: "Failed to retreive inactive users list"
                        });


                    }

                }


            });


        } else {
            res.json({
                status: 0,
                message: "Failed to retreive inactive users list"
            });
        }



    });

});


router.post('/paymenthistory', function(req, res) {

    sub_id = req.body.user_id;
    connection.query('select id from users where subscriber_id=?', [sub_id], function(error, results, fields) {

        id = results[0].id;


        if (results.length > 0) {
            var query = "select DISTINCT  pd.name as sub_name,pd.email as email,pd.primary_mobile as mobile,s.package_id as sub_packageID,cd.collection_mode_id,case when cd.collection_mode_id=1 then 'Cash'  when cd.collection_mode_id=2 then 'Draft' when cd.collection_mode_id=3 then 'Cheque' END  as collection_mode,pf.name as agent_name,case when cd.collected_date is null then '' else  DATE_FORMAT(cd.collected_date, '%d/%m/%Y') end as collected_date,cd.amount as amount,s.payment_mode as payment_mode,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,p.name as sub_package,p.package_status as package_status,p.fee as sub_packamount,p.package_status as package_status,p.description as description,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join collection_details cd on cd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id left join profile_details pf on pf.user_id=cd.agent_id where u.id ='" + id + "'";

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
                        var payment_details = [];
                        // console.log(results1)


                        for (i = 0; i < results.length; i++) {
                            location[i] = {
                                "housename": results[i].housename,
                                "street": results[i].street,
                                "district": results[i].district,
                                "country": results[i].country,
                                "state": results[i].state
                            }

                            payment_details[i] = {
                                "Amount_paid": results[i].amount,
                                "collection_mode_id": results[i].collection_mode_id,
                                "collection_mode": results[i].collection_mode,
                                "collected_date": results[i].collected_date,
                                "is_agent": results[i].payment_mode,
                                "collected_by": results[i].agent_name

                            }

                            subscribers[i] = {
                                "sub_id": sub_id,
                                "name": results[i].sub_name,
                                "Mobile": results[0].mobile,
                                "email": results[0].email,
                                "package_name": results[i].sub_package,
                                "packageID": results[i].sub_packageID,
                                "packamount": results[i].sub_packamount,
                                "pack_description": results[i].description,
                                "expiry_date": results[i].expiry_date,
                                "is_active": results[i].package_status,

                                "location": location[i],
                                "payment_details": payment_details[i]
                            }


                        }

                        res.json({
                            status: 1,
                            message: 'inactive users list retreived successfully',
                            subscribers: subscribers

                        });

                    } else {
                        res.json({
                            status: 0,
                            message: "Failed to retreive inactive users list"
                        });


                    }

                }


            });


        } else {
            res.json({
                status: 0,
                message: "Failed to retreive inactive users list"
            });
        }



    });

});

router.get('/gatewayDetails', function(req, res) {



    var query = "select gateway_name,gateway_short_code,gateway_merchant_code,gateway_merchant_key,post_url,success_url,instalment_success_url,	failure_url from gateway_master ";

    connection.query(query, function(error, results, fields) {
        if (error) {
            console.log(error)
            res.json({
                status: false,
                message: 'there are some error with query'
            })

        } else {
            
            if (results.length > 0) {
              
                res.json({
                    status: 1,
                    message: 'details retreived successfully',
                    gateway:results
                    

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
router.post('/generateTransactionId', function(req, res) {

    user_id = req.body.user_id;
    var date = new Date();
    var timestamp = date. getTime();
    var transactionId="d"+user_id+timestamp;
    // var query = "select gateway_name,gateway_short_code,gateway_merchant_code,gateway_merchant_key,post_url,success_url,instalment_success_url,	failure_url from gateway_master ";

    // connection.query(query, function(error, results, fields) {
    //     if (error) {
    //         console.log(error)
    //         res.json({
    //             status: false,
    //             message: 'there are some error with query'
    //         })

    //     } else {
            
    //         if (results.length > 0) {
              
    //             res.json({
    //                 status: 1,
    //                 message: 'details retreived successfully',
    //                 gateway:results
                    

    //             });
    //         } else {
    //             res.json({
    //                 status: 0,
    //                 message: "Failed to retreive details"
    //             });


    //         }

    //     }
        res.json({
            status: 1,
            message: 'details retreived successfully',
            transactionId:transactionId
         })
        res.end();

    // });



});

router.post('/paymentdonelist', function(req, res) {

    agent_id = req.body.user_id;
    connection.query('SELECT id  FROM users WHERE agent_id=? ', [agent_id], function(error, results, fields) {

        var id = results[0].id

        if (results.length > 0) {
            var query = "select u.subscriber_id as sub_id ,pd.name as sub_name,s.package_id as sub_packageID,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,p.name as sub_package,p.fee as sub_packamount,a.housename,a.street,a.district,c.name as country,st.name as state from subscription s inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id in(select u.id  from users u inner join subscription s on u.id=s.user_id where u.registered_by='" + id + "' and s.payment_done=1 )";

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
                            message: 'payment dues list retreived successfully',
                            subscribers: subscribers

                        });
                    } else {
                        res.json({
                            status: 0,
                            message: "Failed to retreive payment dues list"
                        });


                    }

                }


            });


        } else {
            res.json({
                status: 0,
                message: "Failed to retreive payment dues list"
            });
        }





    });


});



// router.post('/renewpackage', function(req, res) {
//     userid = req.body.userid;
//     package_id = req.body.package_id;
//     package_amount = req.body.package_amount


//     connection.query('SELECT id  FROM users WHERE subscriber_id=? ', [userid], function(error, results, fields) {
//         if (results.length > 0) {
//             var id = results[0].id


//             connection.beginTransaction(function(err) {
//                 if (err) {
//                     res.json({
//                         status: 0,
//                         message: "updation failed"
//                     });
//                     console.log(err)

//                 }



//                 connection.query("update  subscription set package_id='" + package_id + "' where user_id='" + id + "'", function(err, result) {
//                     if (err) {
//                         connection.rollback(function() {
//                             throw err;
//                         });
//                     }

//                     connection.query("insert into   collection_details SET amount='" + package_amount + "',package_id='" + package_id + "',user_id='" + id + "'", function(err, result) {
//                         if (err) {
//                             connection.rollback(function() {
//                                 throw err;
//                             });
//                         }



//                         connection.commit(function(err) {
//                             console.log(err)

//                             if (err) {
//                                 res.json({
//                                     status: 0,
//                                     message: "updation failed"
//                                 });

//                                 connection.rollback(function() {

//                                     throw err;
//                                 });
//                             } else {
//                                 res.json({
//                                     status: 1,
//                                     message: " updated sucessfully"
//                                 });
//                             }
//                             console.log('Transaction Complete.');
//                             //connection.end();
//                         });

//                     });


//                 });

//             });
//         } else {

//             res.json({
//                 status: 0,
//                 message: "updation failed"
//             });
//         }
//     });


// });


module.exports = router;