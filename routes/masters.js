const express = require("express");
const router = express.Router();
var connection = require('../config');
router.get('/listCountries', function(req, res) {
    
    connection.query('SELECT id,name,phonecode FROM countries', function(error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with query'
            })

        } else {

            if (results.length > 0) {
               
                res.json({
                    status: 1,
                    message: 'countries retreived successfully',
                    data: results
                 
                })
            }
                else {
                    res.json({
                        status: 0,
                        message: "Failed to retreive countries"
                    });
                }


            } 
            res.end();



        });
        
    });

router.post('/listStates', function(req, res) {
        country_id= req.body.country_id;
        connection.query('SELECT id,name FROM states WHERE  country_id= ? ', [country_id], function(error, results, fields) {
            if (error) {
                res.json({
                    status: false,
                    message: 'there are some error with query'
                })
    
            } else {
    
                if (results.length > 0) {
                   
                    res.json({
                        status: 1,
                        message: 'states retreived successfully',
                        data: results
                       
    
                    })
                }
                    else {
                        res.json({
                            status: 0,
                            message: "Failed to retreive states"
                        });
                    }
    
    
                } 
                res.end();
    
    
    
            });
            
        });
 router.post('/listDistricts', function(req, res) {
            state_id= req.body.state_id;
            connection.query('SELECT id,name FROM districts WHERE  state_id= ? ', [state_id], function(error, results, fields) {
                if (error) {
                    res.json({
                        status: false,
                        message: 'there are some error with query'
                    })
        
                } else {
        
                    if (results.length > 0) {
                       
                        res.json({
                            status: 1,
                            message: 'districts retreived successfully',
                            data: results
                           
        
                        })
                    }
                        else {
                            res.json({
                                status: 0,
                                message: "Failed to retreive districts"
                            });
                        }
        
        
                    } 
                    res.end();
        
        
        
                });
                
            });
module.exports = router;