const express = require("express");
const router = express.Router();
var connection = require('../config');


router.post('/agentprofile', function(req, res) {
    // token = req.body.token
    // console.log(token)
    // connection.query('SELECT id ,agent_id FROM users WHERE token=? ', [token], function(error, results, fields) {


    //     if (results.length > 0) {
    //         var id = results[0].id;
    //         var agentid = results[0].agent_id;
    //         console.log(results)

    //         connection.query('SELECT name,primary_mobile,email  FROM profile_details WHERE user_id=? ', [id], function(error, results, fields) {
    //             var profilename = results[0].name;
    //             var mobile = results[0].primary_mobile;
    //             var email = results[0].email;
    //             connection.query('SELECT housename,street,district,state_id,country_id  FROM address WHERE user_id=? ', [id], function(error, results, fields) {
    //                 var housename = results[0].housename;
    //                 var street = results[0].street;
    //                 var district = results[0].district;
    //                 var stateid = results[0].state_id;
    //                 console.log(stateid)
    //                 var countryid = results[0].country_id;



    //                 connection.query('SELECT name FROM countries WHERE id=?', [countryid], function(error, results, fields) {


    //                     var countryname = results[0].name;

    //                     // console.log(countryname)
    //                     connection.query('SELECT name FROM states WHERE id=? ', [stateid], function(error, results, fields) {
    //                         var statename = results[0].name;

    //                         //connection.query('SELECT name FROM districts WHERE id=? ', [districtid], function(error, results, fields) {
    //                         // var districtname = results[0].name;

    //                         var addressdata = {
    //                             "housename": housename,
    //                             "street": street,
    //                             "country": countryname,
    //                             "state": statename,
    //                             "district": district,
    //                         }
    //                         var profile_data = {
    //                             "name": profilename,
    //                             "agent_ID": agentid,
    //                             "email": email,
    //                             "mobile": mobile
    //                         }

    //                         res.json({
    //                                 status: 1,
    //                                 profile_data: profile_data,
    //                                 address_data: addressdata,
    //                                 message: 'Profile Fetched successfully',

    //                             })
    //                             // });
    //                     });
    //                 });
    //             });

    //         });
    //     } else {
    //         res.json({
    //             status: 0,
    //             message: " Invalid data"
    //         });
    //     }



    // });




    token = req.body.token
    console.log(token)
    connection.query('SELECT id ,agent_id FROM users WHERE token=? ', [token], function(error, results, fields) {


        if (results.length > 0) {
            var id = results[0].id;
            var agentid = results[0].agent_id;
            console.log(results)

            var query = "select u.agent_id as agent_id,pd.job_title as job_title,pd.name as name,pd.email as email,pd.alternate_mobile as whatsup_number,pd.landline_number as landline_number, pd.currently_employed as currently_employed,pd.basic_education as basic_education,pd.gender as gender,DATE_FORMAT(pd.dob, '%d/%m/%Y') as dob,pd.primary_mobile as mobile,pd.company_name as company_name,pd.company_address as company_address ,pd.name as sub_name,a.housename,a.street,a.pincode as pincode,a.district,c.name as country,c.id as country_id,st.name as state,st.id as state_id from users u inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.id ='" + id + "'";

            connection.query(query, function(error, results, fields) {
                if (error) {
                    res.json({
                        status: 0,
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
                            "Agent_ID": results[0].agent_id,
                            "name": results[0].name,
                            "Mobile": results[0].mobile,
                            "whatsup_number": results[0].whatsup_number,
                            "landline_number": results[0].landline_number,
                            "Email": results[0].email,
                            "Basic_education": results[0].basic_education,
                            "Dob": results[0].dob,
                            "gender": results[0].gender,
                            "currently_employed": results[0].currently_employed,
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



        } else {
            res.json({
                status: 0,
                message: " Invalid data"
            });
        }



    });




});
module.exports = router;