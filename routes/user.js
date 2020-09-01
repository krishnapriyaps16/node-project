const express = require("express");
const router = express.Router();
var connection = require('../config');
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');
const jwt = require("jsonwebtoken");
var random = require('random-string-generator');

var nodemailer = require('nodemailer');


var result = random(6,'lower');


// router.post('/login', function(req, res) {


//     // console.log(req.body);
//     username = req.body.username;
//     password = req.body.password;
//     var loginresults;
//     var userprofile;



//     connection.query('SELECT user_type_id,id,agent_id,password_changed_status,subscriber_id,username,password FROM users WHERE   agent_id= ? or subscriber_id=? ', [username, username], function(error, results, fields) {
//         //console.log(results);
//         if (results.length > 0) {
//             var id = results[0].id;
//             var usertypeid = results[0].user_type_id;
//             if (usertypeid == 3) {


//                 if (password == "admin") {
//                     res.json({
//                         status: 1,
//                         user_type: usertypeid,
//                         message: 'login successfull',

//                     })
//                 } else {
//                     res.json({
//                         status: 0,
//                         message: 'Invalid password',

//                     })

//                 }


//             } else {

//                 connection.query('select name,gender from profile_details where user_id=?', [id], function(error, results1, fields) {


//                     name = results1[0].name;
//                     gender = results1[0].gender;



//                     // var username = results[0].username;

//                     // console.log(username)
//                     var passchangestatus = results[0].password_changed_status;
//                     if (usertypeid == 1) {

//                         var userid = results[0].agent_id
//                             //console.log(userid)
//                     } else {

//                         var userid = results[0].subscriber_id
//                     }


//                     if (passchangestatus == 1) {

//                         var users = {
//                             "user_type_id": usertypeid,
//                             "userid": userid
//                         }


//                         decryptedString = cryptr.decrypt(results[0].password);
//                         console.log(decryptedString);
//                         if (password == decryptedString) {


//                             let token = jwt.sign({ users }, 'SuperSecRetKey', { expiresIn: 60 * 60 }




//                                 //res.json({ token });
//                             );


//                             connection.query('UPDATE users SET token = ? WHERE id = ?', [token, id], function(error, results, fields) {
//                                 //console.log("test")
//                             });



//                             userprofile = {
//                                 "userID": userid,
//                                 "usertoken": token,
//                                 "name": name,
//                                 "gender": gender

//                             }
//                             loginresults = {
//                                 "user_type": usertypeid,
//                                 "pass_changestatus": passchangestatus,
//                                 "userprofile": userprofile

//                             }

//                             if (usertypeid == 1) {
//                                 res.json({
//                                     status: 1,
//                                     user_type: loginresults.user_type,
//                                     pass_changestatus: loginresults.pass_changestatus,
//                                     userprofile: loginresults.userprofile,
//                                     message: 'login successfull',

//                                 })
//                             } else {

//                                 var query = "select s.package_id,s.payment_done as paid_status,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,case when s.expiry_date<=curdate() then 1 else 0 end as expiry_status,p.name as package_name,p.fee as package_amount from subscription s inner join package p on s.package_id=p.id where s.user_id=" + id + " and p.package_status=1";


//                                 connection.query(query, function(error, results, fields) {
//                                     //console.log(results)
//                                     var pack_details = []
//                                     if (error) {
//                                         res.json({
//                                             status: false,
//                                             message: 'there are some error with query'
//                                         })

//                                     } else {
//                                         if (results.length > 0) {

//                                             pack_details = {
//                                                 "pack_id": results[0].package_id,
//                                                 "pack_name": results[0].package_name,
//                                                 "pack_amount": results[0].package_amount,
//                                                 "pack_expireson": results[0].expiry_date,
//                                                 "packexpiry_status": results[0].expiry_status,
//                                                 "paid_status": results[0].paid_status,
//                                             }




//                                             // } else {
//                                             //     res.json({
//                                             //         status: 0,
//                                             //         message: "failed"
//                                             //     });
//                                         }
//                                         res.json({
//                                             status: 1,
//                                             message: 'login successfull',
//                                             user_type: loginresults.user_type,
//                                             pass_changestatus: loginresults.pass_changestatus,
//                                             userprofile: loginresults.userprofile,

//                                             pack_details: pack_details

//                                         })



//                                     }


//                                 });
//                             }


//                         } else {
//                             res.json({
//                                 status: 0,
//                                 message: " password does not match"
//                             });
//                         }
//                     } else {
//                         if (password == results[0].password) {

//                             userprofile = {
//                                 "userID": userid,

//                                 "name": name,
//                                 "gender": gender


//                             }

//                             //var query = "select s.package_id,case when s.expiry_date is null then '' else s.expiry_date end as expiry_date,case when s.expiry_date<=curdate() then 1 else 0 end as expiry_status,p.name as package_name,p.fee as package_amount from subscription s inner join package p on s.package_id=p.id where s.user_id=" + id + " and p.package_status=1";

//                             //connection.query(query, function(error, results, fields) {
//                             // console.log(results)
//                             // var pack_details = []
//                             // if (error) {
//                             //     res.json({
//                             //         status: false,
//                             //         message: 'there are some error with query'
//                             //     })

//                             // } else {
//                             //     if (results.length > 0) {

//                             //         pack_details = {
//                             //             "pack_id": results[0].package_id,
//                             //             "pack_name": results[0].package_name,
//                             //             "pack_amount": results[0].package_amount,
//                             //             "pack_expireson": results[0].expiry_date,
//                             //             "packexpiry_status": results[0].expiry_status
//                             //         }
//                             //     }
//                             // }




//                             res.json({
//                                     status: 1,
//                                     //user_ID: userid,
//                                     user_type: usertypeid,
//                                     pass_changestatus: passchangestatus,
//                                     userprofile: userprofile,
//                                     // pack_details: pack_details,
//                                     // userprofile: loginresults.userprofile,
//                                     message: 'login successfull',

//                                 })
//                                 //});

//                         } else {
//                             res.json({
//                                 status: 0,
//                                 message: " password does not match"
//                             });
//                         }

//                     }
//                 });
//             }


//         }
        
//          else {
             
//             res.json({
//                 status: 0,
//                 message: "invalid user"
//             });
//         }






//         // }
//         // res.end()

//     });




// });
//registration

router.post('/login', function(req, res) {


    // console.log(req.body);
    username = req.body.username;
    password = req.body.password;
    var loginresults;
    var userprofile;
    var query;

    connection.query('SELECT user_id FROM profile_details WHERE   primary_mobile= ? or email=? ', [username, username], function(error, results1, fields) {
        console.log(results1);
        if (results1.length > 0) 
            {
                query="SELECT user_type_id,id,agent_id,password_changed_status,subscriber_id,username,password FROM users WHERE id="+results1[0].user_id+" and is_active=1";
            }
            else
            {
                query="SELECT user_type_id,id,agent_id,password_changed_status,subscriber_id,username,password FROM users WHERE agent_id='"+username+"' or subscriber_id='"+username+"' or(username='"+username+"' and user_type_id in (3,4))  and is_active=1";
            }
            console.log(query);
            connection.query(query, function(error, results, fields) {
                //console.log(results);
                if (results.length > 0) {
                    var id = results[0].id;
                    var usertypeid = results[0].user_type_id;
                    if (usertypeid == 3) {
        
        
                        if (password == "admin") {
                            res.json({
                                status: 1,
                                user_type: usertypeid,
                                message: 'login successfull',
        
                            })
                        } else {
                            res.json({
                                status: 0,
                                message: 'Invalid password',
        
                            })
        
                        }
        
        
                    } else {
        
                        connection.query('select name,gender from profile_details where user_id=?', [id], function(error, results1, fields) {
        
        
                            name = results1[0].name;
                            gender = results1[0].gender;
        
        
        
                            // var username = results[0].username;
        
                            // console.log(username)
                            var passchangestatus = results[0].password_changed_status;
                            if (usertypeid == 1) {
        
                                var userid = results[0].agent_id
                                    //console.log(userid)
                            } else {
        
                                var userid = results[0].subscriber_id
                            }
        
        
                            if (passchangestatus == 1) {
        
                                var users = {
                                    "user_type_id": usertypeid,
                                    "userid": userid
                                }
        
        
                                decryptedString = cryptr.decrypt(results[0].password);
                                console.log(decryptedString);
                                if (password == decryptedString) {
        
        
                                    let token = jwt.sign({ users }, 'SuperSecRetKey', { expiresIn: 60 * 60 }
        
        
        
        
                                        //res.json({ token });
                                    );
        
        
                                    connection.query('UPDATE users SET token = ? WHERE id = ?', [token, id], function(error, results, fields) {
                                        //console.log("test")
                                    });
        
        
        
                                    userprofile = {
                                        "userID": userid,
                                        "usertoken": token,
                                        "name": name,
                                        "gender": gender
        
                                    }
                                    loginresults = {
                                        "user_type": usertypeid,
                                        "pass_changestatus": passchangestatus,
                                        "userprofile": userprofile
        
                                    }
        
                                    if (usertypeid == 1) {
                                        res.json({
                                            status: 1,
                                            user_type: loginresults.user_type,
                                            pass_changestatus: loginresults.pass_changestatus,
                                            userprofile: loginresults.userprofile,
                                            message: 'login successfull',
        
                                        })
                                    } else {
        
                                        var query = "select s.package_id,s.payment_done as paid_status,case when s.expiry_date is null then '' else  DATE_FORMAT(s.expiry_date, '%d/%m/%Y') end as expiry_date,case when s.expiry_date<=curdate() then 1 else 0 end as expiry_status,p.name as package_name,p.fee as package_amount from subscription s inner join package p on s.package_id=p.id where s.user_id=" + id + " and p.package_status=1";
        
        
                                        connection.query(query, function(error, results, fields) {
                                            //console.log(results)
                                            var pack_details = []
                                            if (error) {
                                                res.json({
                                                    status: false,
                                                    message: 'there are some error with query'
                                                })
        
                                            } else {
                                                if (results.length > 0) {
        
                                                    pack_details = {
                                                        "pack_id": results[0].package_id,
                                                        "pack_name": results[0].package_name,
                                                        "pack_amount": results[0].package_amount,
                                                        "pack_expireson": results[0].expiry_date,
                                                        "packexpiry_status": results[0].expiry_status,
                                                        "paid_status": results[0].paid_status,
                                                    }
        
        
        
        
                                                    // } else {
                                                    //     res.json({
                                                    //         status: 0,
                                                    //         message: "failed"
                                                    //     });
                                                }
                                                res.json({
                                                    status: 1,
                                                    message: 'login successfull',
                                                    user_type: loginresults.user_type,
                                                    pass_changestatus: loginresults.pass_changestatus,
                                                    userprofile: loginresults.userprofile,
        
                                                    pack_details: pack_details
        
                                                })
        
        
        
                                            }
        
        
                                        });
                                    }
        
        
                                } else {
                                    res.json({
                                        status: 0,
                                        message: " password does not match"
                                    });
                                }
                            } else {
                                if (password == results[0].password) {
        
                                    userprofile = {
                                        "userID": userid,
        
                                        "name": name,
                                        "gender": gender
        
        
                                    }
        
                                    //var query = "select s.package_id,case when s.expiry_date is null then '' else s.expiry_date end as expiry_date,case when s.expiry_date<=curdate() then 1 else 0 end as expiry_status,p.name as package_name,p.fee as package_amount from subscription s inner join package p on s.package_id=p.id where s.user_id=" + id + " and p.package_status=1";
        
                                    //connection.query(query, function(error, results, fields) {
                                    // console.log(results)
                                    // var pack_details = []
                                    // if (error) {
                                    //     res.json({
                                    //         status: false,
                                    //         message: 'there are some error with query'
                                    //     })
        
                                    // } else {
                                    //     if (results.length > 0) {
        
                                    //         pack_details = {
                                    //             "pack_id": results[0].package_id,
                                    //             "pack_name": results[0].package_name,
                                    //             "pack_amount": results[0].package_amount,
                                    //             "pack_expireson": results[0].expiry_date,
                                    //             "packexpiry_status": results[0].expiry_status
                                    //         }
                                    //     }
                                    // }
        
        
        
        
                                    res.json({
                                            status: 1,
                                            //user_ID: userid,
                                            user_type: usertypeid,
                                            pass_changestatus: passchangestatus,
                                            userprofile: userprofile,
                                            // pack_details: pack_details,
                                            // userprofile: loginresults.userprofile,
                                            message: 'login successfull',
        
                                        })
                                        //});
        
                                } else {
                                    res.json({
                                        status: 0,
                                        message: " password does not match"
                                    });
                                }
        
                            }
                        });
                    }
        
        
                }
                
                 else {
                     
                    res.json({
                        status: 0,
                        message: "invalid user"
                    });
                }
        
        
        
        
        
        
                // }
                // res.end()
        
            });
        
    });
   



});
router.post('/register', function(req, res) {
    
       var username = req.body.email;
    var password = result;

    try {


        if (req.body.basic_education != null && req.body.basic_education != "") {
            basic_education = req.body.basic_education;
        } else {
            basic_education = ""
        }

        if (req.body.currently_employed != null && req.body.currently_employed != "") {
            currently_employed = req.body.currently_employed;
        } else {
            currently_employed = 2

        }
        if (req.body.job_title != null && req.body.job_title != "") {
            job_title = req.body.job_title;
        } else {
            job_title = ""
        }
        if (req.body.company_name != null && req.body.company_name != "") {
            company_name = req.body.company_name;
        } else {
            company_name = ""
        }

        if (req.body.company_address != null && req.body.company_address != "") {
            company_address = req.body.company_address;
        } else {
            company_address = ""
        }
        if (req.body.whatsup_number != null && req.body.whatsup_number != "") {
            whatsup_number = req.body.whatsup_number;
        } else {
            whatsup_number = ""
        }
        if (req.body.landline_number != null && req.body.landline_number != "") {
            landline_number = req.body.landline_number;
        } else {
            landline_number = ""
        }
        if (req.body.is_active == false) {
            is_active = 0;
        } else {
            is_active = 1;
        }


        var userid;


        connection.beginTransaction(function(err) {


            connection.query('select agent_id from users where id in (select max(id) from users where user_type_id=1)', function(err, result) {
                
                console.log(result.length)
                if (result.length > 0) {
                    var agentid = result[0].agent_id


                    if (agentid != null) {

                        var num = agentid.substr(agentid.length - 5);

                        var n = parseInt(num) + 1;

                        //console.log(n)

                    } else {
                        n = 10000
                    }
                } else {
                    n = 10000
                }
                var agntid = "AGNT" + n;

                connection.query('INSERT INTO users SET username=? , password=?, agent_id=?,user_type_id=?,is_active=?', [username, password, agntid, 1,is_active], function(err, result) {
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                    }

                    connection.query('select id from   users where username=? AND password=?', [username, password], function(err, result) {
                        if (err) {
                            connection.rollback(function() {
                                throw err;
                            });
                        } else {
                            userid = result[0].id;
                            // console.log(userid);
                        }

                        name = req.body.name;
                        gender = req.body.gender;
                        primarymobile = req.body.primary_mobile;

                        email = req.body.email;





                        dob = req.body.dob;
                        //if (currently_employed == 1) {

                        var sql = "INSERT INTO profile_details (name,gender,primary_mobile,alternate_mobile,email,basic_education,currently_employed,dob,job_title,company_name,company_address,user_id,landline_number) values ('" + name + "', '" + gender + "', '" + primarymobile + "','" + whatsup_number + "', '" + email + "', '" + basic_education + "', '" + currently_employed + "', '" + dob + "','" + job_title + "','" + company_name + "','" + company_address + "', '" + userid + "','"+landline_number+"')"

                        //} else {
                        // var sql = "INSERT INTO profile_details (name,gender,primary_mobile,alternate_mobile,email,basic_education,currently_employed,dob,user_id) values ('" + name + "', '" + gender + "', '" + primarymobile + "','" + whatsup_number + "','" + email + "', '" + basic_education + "', '" + currently_employed + "', '" + dob + "', '" + userid + "')"

                        //}



                        connection.query(sql, function(err, result) {
                            if (err) {
                                connection.rollback(function() {
                                    throw err;
                                });
                            }




                            housename = req.body.housename;
                            street = req.body.street;
                            district = req.body.district;
                            state_id = req.body.state_id;
                            country_id = req.body.country_id;
                            pincode = req.body.pincode;


                            connection.query('INSERT INTO address SET housename=? , street=? , district=? , state_id=? , country_id=? , pincode=? , user_id=? ', [housename, street, district, state_id, country_id, pincode, userid], function(err, result) {

                                if (err) {
                                    connection.rollback(function() {
                                        throw err;
                                    });
                                }
                                connection.commit(function(err) {
                                    if (err) {
                                        res.json({
                                            status: 0,
                                            message: "Registration failed"
                                        });

                                        connection.rollback(function() {

                                            throw err;
                                        });
                                    } else {
                                        res.json({
                                            status: 1,
                                            message: " registered sucessfully",
                                            agent_id: agntid
                                        });
                                        sentemailagent();
                                    }
                                    console.log('Transaction Complete.');
                                    // connection.end();
                                    // res.end();
                                });
                            });
                        });


                    });
                });
            });

        });


    } catch (ex) {

        console.log(ex)

    }





});



//change password


router.post('/changepassword', function(req, res) {
console.log(req.body);
    var oldpassword = req.body.oldpassword;
    //console.log(oldpassword)
    var newpassword = req.body.newpassword;
    var userid = req.body.userid;

    encryptedString = cryptr.encrypt(newpassword);

    //console.log(encryptedString)
    connection.query('SELECT password FROM users WHERE agent_id=? or subscriber_id=? ', [userid, userid], function(error, results, fields) {
        console.log(results);
        if (error) {
            res.json({
                status: 0,
                message: 'invalid password'
            })

        } else {
            if (results.length > 0) {

                var passwordold = results[0].password;
                // console.log(passwordold)
                if (passwordold == oldpassword) {
                    // console.log("hhh")
                    connection.query('UPDATE users SET password = ?, password_changed_status=? WHERE agent_id=? or subscriber_id=?', [encryptedString, 1, userid, userid], function(error, results, fields) {
                        //console.log("test")
                        if (error) {
                            res.json({
                                status: 0,
                                message: 'invalid password'
                            })

                        } else {
                            res.json({
                                status: 1,

                                message: 'password changed successfully',

                            })
                        }
                    });



                } else {

                    res.json({
                            status: 0,
                            message: 'invalid password'
                        })
                        //console.log(error)
                        // throw error

                }
            }
        }


    });





});


router.post('/registersubscriber', function(req, res) {

    var username = req.body.email;
    var password = result;
    console.log("ttt")
console.log(username)
    var userid;


    name = req.body.name;
    gender = req.body.gender;
    primarymobile = req.body.primary_mobile;
    email = req.body.email;
    console.log(name)
    //basic_education = req.body.basic_education;
    // currently_employed = req.body.currently_employed;
    housename = req.body.housename;
    street = req.body.street;
    district = req.body.district;
    state_id = req.body.state_id;
    country_id = req.body.country_id;
    pincode = req.body.pincode;
    isabroad = req.body.isabroad;



    dob = req.body.dob;
    package_id = req.body.package_id;
    payment_done = req.body.payment_done;
    //agent_id = req.body.agent_id;
    // alternate_mobile = req.body.whatsup_number;

    if (req.body.basic_education != null && req.body.basic_education != "") {
        basic_education = req.body.basic_education;
    } else {
        basic_education = ""
    }

    if (req.body.currently_employed != null && req.body.currently_employed != "") {
        currently_employed = req.body.currently_employed;
    } else {
        currently_employed = 2

    }
    if (req.body.whatsup_number != null && req.body.whatsup_number != "") {
        alternate_mobile = req.body.whatsup_number;
    } else {
        alternate_mobile = ""
    }
    if (req.body.job_title != null && req.body.job_title != "") {
        job_title = req.body.job_title;
    } else {
        job_title = ""
    }
    if (req.body.company_name != null && req.body.company_name != "") {
        company_name = req.body.company_name;
    } else {
        company_name = ""
    }

    if (req.body.company_address != null && req.body.company_address != "") {
        company_address = req.body.company_address;
    } else {
        company_address = ""
    }

    if (req.body.agent_id != null && req.body.agent_id != "") {
        agent_id = req.body.agent_id;
    } else {
        agent_id = ""
    }
    if (req.body.landline_number != null && req.body.landline_number != "") {
        landline_number = req.body.landline_number;
    } else {
        landline_number = ""
    }
    if(primarymobile=='')
        primarymobile="invalid mobile";
    if(email=='')
         email="invalid email";
    connection.query("SELECT * FROM profile_details WHERE primary_mobile = '" + primarymobile + "'", function(err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {

                res.json({
                    status: 0,
                    message: "This phone no already exist"
                });
            } else {
                connection.query("SELECT * FROM profile_details WHERE email = '" + email + "'", function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (result.length > 0) {

                            res.json({
                                status: 0,
                                message: "This email already exist"
                            });
                        } else {


                            connection.beginTransaction(function(err) {


                                connection.query('select subscriber_id from users where id in (select max(id) from users where user_type_id=2)', function(err, result) {

                                    if (result.length > 0) {
                                        var subid = result[0].subscriber_id


                                        if (subid != null) {

                                            var num = subid.substr(subid.length - 5);

                                            var n = parseInt(num) + 1;

                                            // console.log(n)

                                        } else {
                                            n = 10000
                                        }
                                    } else {
                                        n = 10000
                                    }


                                    connection.query('INSERT INTO users SET username=? , password=?, user_type_id=?', [username, password, 2], function(err, result) {
                                        if (err) {
                                            connection.rollback(function() {
                                                throw err;
                                            });
                                        }

                                        connection.query('select id from   users where username=? AND password=?', [username, password], function(err, result) {
                                            if (err) {
                                                connection.rollback(function() {
                                                    throw err;
                                                });
                                            } else {
                                                userid = result[0].id;

                                            }


                                            //if (currently_employed == 1) {

                                            var sql = "INSERT INTO profile_details (name,gender,primary_mobile,alternate_mobile,email,basic_education,currently_employed,dob,job_title,company_name,company_address,user_id,landline_number) values ('" + name + "', '" + gender + "', '" + primarymobile + "','" + alternate_mobile + "','" + email + "', '" + basic_education + "', '" + currently_employed + "',  STR_TO_DATE('" + dob + "', '%Y-%m-%d'),'" + job_title + "','" + company_name + "','" + company_address + "', '" + userid + "','"+landline_number+"')"

                                            // } else {
                                            // var sql = "INSERT INTO profile_details (name,gender,primary_mobile,alternate_mobile,email,basic_education,currently_employed,dob,user_id) values ('" + name + "', '" + gender + "', '" + primarymobile + "','" + alternate_mobile + "','" + email + "', '" + basic_education + "', '" + currently_employed + "',STR_TO_DATE('" + dob + "', '%Y-%m-%d'), '" + userid + "')"

                                            // }



                                            connection.query(sql, function(err, result) {
                                                if (err) {
                                                    connection.rollback(function() {
                                                        throw err;
                                                    });
                                                }


                                                connection.query('INSERT INTO subscription SET package_id=? , payment_done=?, user_id=?', [package_id, payment_done, userid], function(err, result) {
                                                    if (err) {
                                                        connection.rollback(function() {
                                                            throw err;
                                                        });
                                                    }

                                                    connection.query('INSERT INTO address SET housename=? , street=? , district=? , state_id=? , country_id=? , pincode=? , user_id=? ', [housename, street, district, state_id, country_id, pincode, userid], function(err, result) {

                                                        if (err) {
                                                            connection.rollback(function() {
                                                                throw err;
                                                            });
                                                        }

                                                        if (isabroad == 1) {
                                                            var country = 1
                                                        } else {
                                                            country = 0
                                                        }



                                                        connection.query('select user_type_id from users where id=?', [userid], function(err, result) {

                                                            var subscription = result[0].user_type_id




                                                            var subscriberid = formatDate(d) + subscription + country + n
                                                                //console.log(subscriberid);
                                                            if (agent_id != "") {
                                                                connection.query('select id from users where agent_id=?', [agent_id], function(err, results) {

                                                                    var id = results[0].id;
                                                                    //console.log(id)
                                                                    console.log(agent_id)



                                                                    registered_by = id;
                                                                    console.log(registered_by)

                                                                    connection.query('update users set subscriber_id=?,registered_by=? where id=?', [subscriberid, registered_by, userid], function(err, result) {




                                                                        connection.commit(function(err) {
                                                                            if (err) {
                                                                                res.json({
                                                                                    status: 0,
                                                                                    message: "Registration failed "
                                                                                });

                                                                                connection.rollback(function() {

                                                                                    throw err;
                                                                                });
                                                                            } else {

                                                                                res.json({
                                                                                    status: 1,
                                                                                    message: " registered sucessfully",
                                                                                    sub_ID: subscriberid
                                                                                });
                                                                                sentemail()
                                                                            }
                                                                            console.log('Transaction Complete.');
                                                                            //   connection.end();
                                                                        });
                                                                    });
                                                                });

                                                            } else {



                                                                connection.query('update users set subscriber_id=?,registered_by=? where id=?', [subscriberid, 0, userid], function(err, result) {
                                                                    connection.commit(function(err) {
                                                                        if (err) {
                                                                            res.json({
                                                                                status: 0,
                                                                                message: "Registration failed in commit"
                                                                            });

                                                                            connection.rollback(function() {

                                                                                throw err;
                                                                            });
                                                                        } else {
                                                                            res.json({
                                                                                status: 1,
                                                                                message: " registered sucessfully",
                                                                                sub_ID: subscriberid
                                                                            });
                                                                            sentemail()
                                                                        }
                                                                        console.log('Transaction Complete.');
                                                                        // connection.end();
                                                                    });
                                                                });
                                                            }




                                                        });
                                                    });
                                                });
                                            });


                                        });
                                    });
                                });
                            });
                        }
                    }
                });
            }
        }

    });

});



var d = new Date();

function formatDate(d) {


    var month = d.getMonth();



    var year = d.getFullYear();


    year = year.toString().substr(-2);


    month = (month + 1).toString();


    if (month.length === 1) {
        month = "0" + month;
    }



    return year + month;
}

router.post('/registeradmin', function(req, res) {

    console.log(req)
    var username = req.body.name;
    var password = result;
    name = req.body.name;
    gender = req.body.gender;
    primarymobile = req.body.primary_mobile;
    dob = req.body.dob;

    email = req.body.email;

    try {


        if (req.body.whatsup_number != null && req.body.whatsup_number != "") {
            whatsup_number = req.body.whatsup_number;
        } else {
            whatsup_number = ""
        }

        if (req.body.landline_number != null && req.body.landline_number != "") {
            landline_number = req.body.landline_number;
        } else {
            landline_number = ""
        }

        var userid;


        connection.beginTransaction(function(err) {

            connection.query('INSERT INTO users SET username=? , password=?,user_type_id=?', [username, password, 4], function(err, result) {
                if (err) {
                    connection.rollback(function() {
                        throw err;
                    });
                }

                connection.query('select id from   users where username=? AND password=?', [username, password], function(err, result) {
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                    } else {
                        userid = result[0].id;
                        // console.log(userid);
                    }

                    var sql = "INSERT INTO profile_details (name,gender,primary_mobile,alternate_mobile,email,dob,user_id,landline_number) values ('" + name + "', '" + gender + "', '" + primarymobile + "','" + whatsup_number + "','" + email + "', '" + dob + "', '" + userid + "','"+landline_number+"')"

                    connection.query(sql, function(err, result) {
                        if (err) {
                            connection.rollback(function() {
                                throw err;
                            });
                        }

                        housename = req.body.housename;
                        street = req.body.street;
                        district = req.body.district;
                        state_id = req.body.state_id;
                        country_id = req.body.country_id;
                        pincode = req.body.pincode;


                        connection.query('INSERT INTO address SET housename=? , street=? , district=? , state_id=? , country_id=? , pincode=? , user_id=? ', [housename, street, district, state_id, country_id, pincode, userid], function(err, result) {

                            if (err) {
                                connection.rollback(function() {
                                    throw err;
                                });
                            }
                            connection.commit(function(err) {
                                if (err) {
                                    res.json({
                                        status: 0,
                                        message: "Registration failed"
                                    });

                                    connection.rollback(function() {

                                        throw err;
                                    });
                                } else {
                                    res.json({
                                        status: 1,
                                        message: " registered sucessfully"
                                    });
                                }
                                console.log('Transaction Complete.');
                                // connection.end();
                                // res.end();
                            });
                        });
                    });


                });
            });


        });


    } catch (ex) {

        console.log(ex)

    }

});


function sentemail() {

    connection.query('select subscriber_id from users where id in (select max(id) from users where user_type_id=2)', function(err, result) {
        if (result.length > 0) {
            var subid = result[0].subscriber_id
        }


        connection.query('select u.password,p.email from profile_details p  inner join users u on p.user_id=u.id where u.subscriber_id=?', [subid], function(err, result) {
            var email = result[0].email;
            var password = result[0].password;

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'sgs.gurukulam@gmail.com',
                    pass: '@guru.1234'
                }
                
            });


            var mailOptions = {
                from: 'sgs.gurukulam@gmail.com',
                to: email,
                subject: 'Temporary password',
                text: 'Your Temporary password is ' + password
                    //html: '<b>please click here to Change password<a href="http://52.55.205.218:5555/user/changepassword">clickHere</a></b>'
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    });
}

function sentemailagent() {

    connection.query('select agent_id from users where id in (select max(id) from users where user_type_id=1)', function(err, result) {
        if (result.length > 0) {
            var agentid = result[0].agent_id
        }


        connection.query('select u.password,p.email from profile_details p  inner join users u on p.user_id=u.id where u.agent_id=?', [agentid], function(err, result) {
            var email = result[0].email;
            var password = result[0].password;

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'krishnapriya.ps@saasvaap.com',
                    pass: 'kpsaasvaap'
                }
            });

            var mailOptions = {
                from: 'krishnapriya.ps@saasvaap.com',
                to: email,
                subject: 'Temporary password',
                html: 'Your Temporary password is ' + password + '  <a href="http://localhost:4200/change-password?agent_id=' + agentid + '">please click here to Change password</a>'
                    //html: '<p>Click <a href="http://localhost:3000/sessions/recover/' + recovery_token + '">here</a> to reset your password</p>'
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    });
}

module.exports = router;