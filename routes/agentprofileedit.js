const express = require("express");
const router = express.Router();
var connection = require('../config');




router.post('/agentedit', function(req, res) {
    userid = req.body.userid;
    var agentname = req.body.name;
    var email = req.body.email;
    var mobile = req.body.primary_mobile;
    basic_education = req.body.basic_education;
    currently_employed = req.body.currently_employed;
    var gender = req.body.gender;
    var housename = req.body.housename;
    var street = req.body.street;

    var countryid = req.body.country_id;
    var stateid = req.body.state_id;
    var pincode = req.body.pincode;
    var district = req.body.district;
    var job_title = req.body.job_title;
    var company_name = req.body.company_name;
    var company_address = req.body.company_address;
    dob = req.body.dob;
    alternate_mobile = req.body.whatsup_number;
    var landline_number = req.body.landline_number;

    connection.query('SELECT id  FROM users WHERE agent_id=? ', [userid], function(error, results, fields) {
        if (results.length > 0) {
            var id = results[0].id


            connection.beginTransaction(function(err) {
                if (err) {
                    res.json({
                        status: 0,
                        message: "updation failed"
                    });

                }



                connection.query("update  profile_details set name='" + agentname + "' ,primary_mobile='" + mobile + "' ,alternate_mobile='" + alternate_mobile + "',landline_number='"+landline_number+"', email='" + email + "' ,job_title='" + job_title + "',company_name='" + company_name + "',company_address='" + company_address + "', basic_education='" + basic_education + "',currently_employed='" + currently_employed + "',dob=STR_TO_DATE('" + dob + "', '%Y-%m-%d'),gender='" + gender + "' where user_id='" + id + "'", function(err, result) {
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                    }

                    connection.query('update  address SET housename=? , street=? , district=? , state_id=? , country_id=? ,pincode=?where user_id=?  ', [housename, street, district, stateid, countryid, pincode, id], function(err, result) {
                        if (err) {
                            connection.rollback(function() {
                                throw err;
                            });
                        }



                        connection.commit(function(err) {
                            if (err) {
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
module.exports = router;