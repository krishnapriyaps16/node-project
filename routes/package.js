const express = require("express");
var bodyParser = require('body-parser');
const router = express.Router();
var connection = require('../config');


router.get('/listCategory', function(req, res) {
    
    connection.query('SELECT id,category_name FROM main_categories where parent_id=0', function(error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with query'
            })

        } else {

            if (results.length > 0) {
               
                res.json({
                    status: 1,
                    message: 'category retreived successfully',
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

router.post('/listSubcategory', function(req, res) {
        Category_id= req.body.category_id;
        connection.query('SELECT id,category_name FROM main_categories WHERE  parent_id= ? ', [Category_id], function(error, results, fields) {
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



router.get('/listMaincategory', function(req, res) {
        connection.query("select products.id as id,products.product_name,products.category_id,products.parent_id,mc.category_name, case when products.parent_id=3 then 'Green' when products.parent_id=4 then 'red' when products.parent_id=5 then 'Yellow' else  'Violet'  end as subcategory_name from products products inner join main_categories mc on mc.id=products.category_id  ", function(error, results, fields) {
            if (error) {
                res.json({
                    status: false,
                    message: 'there are some error with query'
                })
    
            } else {
    
                if (results.length > 0) {
    
                    res.json({
                        status: 1,
                        message: 'category retreived successfully',
                        packages: results
    
                    })
                } else {
                    res.json({
                        status: false,
                        message: "Failed to retreive category"
                    });
                }
    
    
            }
            res.end();
    
        });
    
    });

   

    router.post('/Addproducts', function(req, res) {

            Category_id = req.body.Category_id;
            parent_id = req.body.parent_id;
            product_name = req.body.product_name;
        
        
            connection.query('insert into products set Category_id=? ,parent_id=?,product_name=?', [Category_id, parent_id, product_name], function(error, results, fields) {
                if (error) {
                    console.log(error);
                    res.json({
        
                        status: 0,
                        message: 'Failed to add products'
                    })
        
                } else {
        
        
        
                    res.json({
                            status: 1,
                            message: 'produts inserted successfully',
                            packages: results
        
                        })
                       
        
                }
                res.end();
        
        
        
            });
        
        });

        router.patch('/categoryedit', function(req, res) {

            Category_id = req.body.Category_id;
            parent_id = req.body.parent_id;
            product_name = req.body.product_name;
               id=req.body.id
            
                connection.query('update products set Category_id=? ,parent_id=?,product_name=? where id=?', [Category_id, parent_id, product_name,id], function(error, results, fields) {
                    if (error) {
                        console.log(error)
                        res.json({
                            status: false,
                            message: 'there are some error with query'
                        })
            
            
                    } else {
            
                        res.json({
                            status: 1,
                            message: 'updated successfully',
            
            
                        })
            
                    }
                    res.end();
            
                });
            
            
            });
            
        
module.exports = router;