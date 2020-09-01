const express = require("express");
var bodyParser = require('body-parser');
const router = express.Router();
// var app = express()


// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
let multer = require('multer');

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
var randomstring = require("randomstring");
//let upload = multer({ storage: multer.memoryStorage() });
var upload = multer({ dest: 'uploads/' })
var fs = require('fs');

var connection = require('../config');
router.get('/listAllPackages', function(req, res) {
    connection.query("SELECT id ,name FROM package", function(error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with query'
            })

        } else {

            if (results.length > 0) {

                res.json({
                    status: 1,
                    message: 'packages retreived successfully',
                    packages: results

                })
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
router.post('/listPackages', function(req, res) {
    is_abroad = req.body.is_abroad;
    connection.query("SELECT distinct p.id as package_id,pb.book_id as book_id,b.title as title,p.name as package_name,p.start_month as start_month,p.no_of_months as no_of_months,DATE_FORMAT(p.valid_from, '%m/%d/%Y') as valid_from,DATE_FORMAT(p.valid_to, '%m/%d/%Y') as valid_to,p.description as package_description,p.fee as package_amount,p.package_status,0 as volume_count FROM package p left join package_books pb on pb.package_id=p.id left join books b on b.id=pb.book_id where p.is_abroad= ? order by package_id desc", [is_abroad], function(error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with query'
            })

        } else {

            if (results.length > 0) {

                res.json({
                    status: 1,
                    message: 'packages retreived successfully',
                    packages: results

                })
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
router.post('/listVolumes', function(req, res) {
    user_id = req.body.user_id;
    var query = "SELECT br.id as volume_id,br.volume as volume_name,case when br.release_date is null then '' else  DATE_FORMAT(br.release_date, '%d/%m/%Y') end  as volume_releasedon ,br.thumpnail as volume_thumpnail,br.attachment as volume_pdfurl,p.id as pack_id,p.name as pack_name,p.fee as package_amount,pd.name,pd.gender   FROM books_release br inner join books b on br.book_id=b.id inner join package_books pb on pb.book_id=b.id inner join subscription s on s.package_id=pb.package_id inner join package p on s.package_id=p.id inner join users u on s.user_id=u.id inner join profile_details pd on pd.user_id=u.id where u.subscriber_id='" + user_id + "' and br.release_date between s.paid_on and s.expiry_date";
    connection.query(query, function(error, results, fields) {
        if (error) {
            res.json({
                status: false,
                message: 'there are some error with query'
            })

        } else {
            var volumes = [];

            var pack_name;
            var pack_id;

            if (results.length > 0) {




                for (i = 0; i < results.length; i++) {
                    pack_name = results[i].pack_name;
                    pack_id = results[i].pack_id;
                    volumes[i] = {
                        "volume_id": results[i].volume_id,
                        "volume_name": results[i].volume_name,
                        "volume_releasedon": results[i].volume_releasedon,
                        "volume_thumpnail": results[i].volume_thumpnail,
                        "volume_pdfurl": results[i].volume_pdfurl,
                    }
                }


                var profile_details = {
                    "userid": user_id,
                    "name": results[0].name,
                    "gender": results[0].gender,

                }
                res.json({
                    status: 1,
                    message: 'volumes retreived successfully',
                    pack_name: pack_name,
                    pack_id: pack_id,
                    pack_amount: results[0].package_amount,
                    profile_details: profile_details,
                    volumes: volumes

                })
            } else {
                res.json({
                    status: 0,
                    message: "Failed to retreive volumes"
                });
            }


        }
        res.end();



    });

});




router.post('/AddPackages', function(req, res) {
    package_name = req.body.package_name;
    package_fee = req.body.fees;
    description = req.body.Description;
    valid_from = req.body.Valid_from;
    valid_to = req.body.Valid_to;
    start_month = req.body.Start_month;
    no_of_months = req.body.no_of_months;
  // is_abroad = req.body.is_abroad;
    book_id = req.body.book_id
    if (req.body.is_abroad == false) {
        is_abroad = 0;
    } else {
        is_abroad = 1;
    }


    connection.query('insert into package set name=? ,description=?,fee=?,valid_from=?,valid_to=?,start_month=?,no_of_months=?,is_abroad=?', [package_name, description, package_fee, valid_from, valid_to, start_month, no_of_months, is_abroad], function(error, results, fields) {
        if (error) {
            console.log(error);
            res.json({

                status: 0,
                message: 'there are some error with query'
            })

        } else {

            // if (results.length > 0) {
            connection.query('select id from package where id in (select max(id) from package)', function(err, result) {

                if (error) {
                    console.log(error);
                    res.json({

                        status: 0,
                        message: 'there are some error with query'
                    })

                } else {
                    var package_id = result[0].id;
                    // console.log(package_id);

                    connection.query('insert into package_books set package_id=?,book_id=?', [package_id, book_id], function(error, results, fields) {
                        if (error) {
                            console.log(error);
                            res.json({

                                status: 0,
                                message: 'there are some error with query'
                            })
                        } else {
                            res.json({
                                status: 1,
                                message: 'packages inserted successfully',
                                packages: results

                            })
                        }

                    });
                }




            });






        }
    });
});


router.post('/AddBooks', function(req, res) {

    title = req.body.title;
    description = req.body.description;
    published_date = req.body.published_date;


    connection.query('insert into books set title=? ,description=?,published_date=?', [title, description, published_date], function(error, results, fields) {
        if (error) {
            console.log(error);
            res.json({

                status: 0,
                message: 'Failed to retreive packages'
            })

        } else {



            res.json({
                    status: 1,
                    message: 'Books inserted successfully',
                    packages: results

                })
                //} else {
                // res.json({
                //  status: false,
                //  message: "Failed to retreive packages"
                // });
                // }


        }
        res.end();



    });

});

router.get('/listBooks', function(req, res) {

    connection.query("SELECT distinct  id as book_id, title,description, DATE_FORMAT(published_date, '%m/%d/%Y') as published_date from books order by book_id desc", function(error, results, fields) {
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
                    message: 'Books retreived successfully',
                    packages: results

                })
            } else {
                res.json({
                    status: 0,
                    message: "Failed to retreive Books"
                });
            }


        }
        res.end();

    });

});




router.post('/AddBookrelease', multipartMiddleware, function(req, res) {

    var tmp_thumpnail_path = req.files.Thumpnail.path;


    var target_thumpnail_path = './uploads/thumpnail/' + randomstring.generate(25) + '.jpg';

    fs.readFile(tmp_thumpnail_path, function(err, data) {
        if (err) throw err;
        console.log('File read!');
        // Write the file 
        fs.writeFile(target_thumpnail_path, data, function(err) {
            if (err) throw err;
            // res.write('File uploaded and moved!'); 
            //res.end(); 
            console.log('File written!');
        });
        // Delete the file 
        fs.unlink(tmp_thumpnail_path, function(err) {
            if (err) throw err;
            console.log('File deleted!');
        });
    });
    var tmp_attachment_path = req.files.Attachment.path;
    var target_attachment_path = './uploads/attachment/' + randomstring.generate(25) + '.pdf';
    fs.readFile(tmp_attachment_path, function(err, data) {
        if (err) throw err;
        console.log('File read!');
        // Write the file 
        fs.writeFile(target_attachment_path, data, function(err) {
            if (err) throw err;
            // res.write('File uploaded and moved!'); 
            //res.end(); 
            console.log('File written!');
        });
        // Delete the file 
        fs.unlink(tmp_attachment_path, function(err) {
            if (err) throw err;
            console.log('File deleted!');
        });
    });
    book = req.body.book;
    volume = req.body.volume;
    release_date = req.body.release_date;
    var path = require('path');
    var thumpnailfile = "http://52.55.205.218:5555/" + path.basename(target_thumpnail_path);
    var attachmentfile = "http://52.55.205.218:5555/" + path.basename(target_attachment_path);
    // var relThumpnailPath = path.resolve(process.cwd(), target_thumpnail_path);
    // var relAttachmentPath = path.resolve(process.cwd(), target_attachment_path);
    // global.appRoot = path.resolve(__dirname);
    //target_thumpnail_path= global.appRoot +"\\"+relThumpnailPath;
    connection.query('insert into books_release set book_id=? ,volume=?,thumpnail=?,attachment=?,Release_Date=?', [book, volume, thumpnailfile, attachmentfile, release_date], function(error, results, fields) {
        if (error) {
            throw error;
            res.json({

                status: false,
                message: error
            })

        } else {



            res.json({
                    status: 1,
                    message: 'Books inserted successfully',
                    packages: results

                })
                //} else {
                // res.json({
                //  status: false,
                //  message: "Failed to retreive packages"
                // });
                // }


        }
        res.end();



    });

});

router.post('/EditBookrelease', multipartMiddleware, function(req, res) {
console.log(req.body);
console.log(req.files.Thumpnail);
    var id = req.body.id;
    var tmp_thumpnail_path ;
    var target_thumpnail_path;
    var path = require('path');
    var thumpnailfile;
    var attachmentfile;
    book = req.body.book;
    volume = req.body.volume;
    release_date = req.body.release_date;
    if(req.files.Thumpnail)
    {
        tmp_thumpnail_path= req.files.Thumpnail.path;


        target_thumpnail_path = './uploads/thumpnail/' + randomstring.generate(25) + '.jpg';
    
        fs.readFile(tmp_thumpnail_path, function(err, data) {
            if (err) throw err;
            console.log('File read!');
            // Write the file 
            fs.writeFile(target_thumpnail_path, data, function(err) {
                if (err) throw err;
                // res.write('File uploaded and moved!'); 
                //res.end(); 
                console.log('File written!');
            });
            // Delete the file 
            fs.unlink(tmp_thumpnail_path, function(err) {
                if (err) throw err;
                console.log('File deleted!');
            });
        });
        thumpnailfile = "http://52.55.205.218:5555/" + path.basename(target_thumpnail_path);
        connection.query('update books_release set book_id=? ,volume=?,thumpnail=?,Release_Date=? where id=?', [book, volume, thumpnailfile, release_date, id], function(error, results, fields) {
            if (error) {
                throw error;
                res.json({
    
                    status: false,
                    message: error
                })
    
            } else {
    
    
    
                res.json({
                    status: 1,
                    message: 'Books inserted successfully',
                    packages: results
    
                })
    
    
    
            }
            res.end();
    
    
    
        });
    }
   
    var tmp_attachment_path; 
    var target_attachment_path;
    if(req.files.Attachment)
    {
        tmp_attachment_path = req.files.Attachment.path;
        target_attachment_path = './uploads/attachment/' + randomstring.generate(25) + '.pdf';
        fs.readFile(tmp_attachment_path, function(err, data) {
            if (err) throw err;
            console.log('File read!');
            // Write the file 
            fs.writeFile(target_attachment_path, data, function(err) {
                if (err) throw err;
                // res.write('File uploaded and moved!'); 
                //res.end(); 
                console.log('File written!');
            });
            // Delete the file 
            fs.unlink(tmp_attachment_path, function(err) {
                if (err) throw err;
                console.log('File deleted!');
            });
        });
       
        attachmentfile = "http://52.55.205.218:5555/" + path.basename(target_attachment_path);
        connection.query('update books_release set book_id=? ,volume=?,attachment=?,Release_Date=? where id=?', [book, volume, attachmentfile, release_date, id], function(error, results, fields) {
            if (error) {
                throw error;
                res.json({
    
                    status: false,
                    message: error
                })
    
            } else {
    
    
    
                res.json({
                    status: 1,
                    message: 'Books inserted successfully',
                    packages: results
    
                })
    
    
    
            }
            res.end();
    
    
    
        });
    }
  if(!req.files.Thumpnail && !req.files.Attachment)
  {
    connection.query('update books_release set book_id=? ,volume=?,Release_Date=? where id=?', [book, volume, release_date, id], function(error, results, fields) {
        if (error) {
            throw error;
            res.json({

                status: false,
                message: error
            })

        } else {



            res.json({
                status: 1,
                message: 'Books inserted successfully',
                packages: results

            })



        }
        res.end();



    });
  }
   
    
   
  

});


router.get('/listBooksrelease', function(req, res) {

    connection.query("SELECT br.id as id,b.title as title,br.volume as volume,br.thumpnail as thumpnail,br.attachment as attachment,DATE_FORMAT(br.release_date , '%m/%d/%Y') as release_date from books b inner join books_release br on b.id=br.book_id order by br.id desc", function(error, results, fields) {
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
                    message: 'Books retreived successfully',
                    packages: results

                })
            } else {
                res.json({
                    status: 0,
                    message: "Failed to retreive Books"
                });
            }


        }
        res.end();

    });

});

router.get('/listPreviousBooksrelease', function(req, res) {

    connection.query("SELECT br.id as id,b.title as title,br.volume as volume,br.thumpnail as thumpnail,br.attachment as attachment,DATE_FORMAT(br.release_date , '%m/%d/%Y') as release_date,year(release_date) as release_year from books b inner join books_release br on b.id=br.book_id where year(release_date) >= year(CURRENT_DATE)-4 group by release_date order by br.id desc", function(error, results, fields) {
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
                    message: 'Volumes retreived successfully',
                    packages: results

                })
            } else {
                res.json({
                    status: 0,
                    message: "Failed to retreive Books"
                });
            }


        }
        res.end();

    });

});

router.get('/listagents', function(req, res) {

    connection.query("select u.id as id,u.agent_id as Agent_id,u.subscriber_id as subscriber_id,u.is_active,case when u.user_type_id=1 then 'Agent' when u.user_type_id=2 then 'Subscriber' when u.user_type_id=4 then 'Admin' end as user_type_id,pd.job_title as job_title,pd.name as Name,pd.email as Email,pd.alternate_mobile as whatsup_number,pd.currently_employed as currently_employed,pd.basic_education as basic_education,pd.gender as gender,DATE_FORMAT(pd.dob, '%d/%m/%Y') as dob,pd.primary_mobile as Mobile,pd.landline_number,pd.company_name as company_name,pd.company_address as company_address ,pd.name as sub_name,a.housename,a.street,a.pincode as pincode,a.district,c.name as country,c.id as country_id,st.name as state,st.id as state_id from users u left join profile_details pd on pd.user_id=u.id left join address a on a.user_id=u.id left join countries c on c.id=a.country_id left join states st on st.id=a.state_id where u.user_type_id!=3 order by u.id desc", function(error, results, fields) {


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
                    message: 'Agents retreived successfully',
                    packages: results

                })
            } else {
                res.json({
                    status: 0,
                    message: "Failed to retreive Agents"
                });
            }


        }
        res.end();

    });

});

router.patch('/agenteditadmin', function(req, res) {

    agent_id = req.body.agent_id;
    var agentname = req.body.name;
    var email = req.body.email;
    var mobile = req.body.primary_mobile;

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
    var pincode = req.body.pincode;
    dob = req.body.dob;
    alternate_mobile = req.body.whatsup_number;
    var landline_number=req.body.landline_number;
    if(req.body.is_active==true)
    {
        is_active=1
    }
    else
    {
        is_active=0
    }
    connection.query('SELECT id  FROM users WHERE agent_id=? ', [agent_id], function(error, results, fields) {
        if (results.length > 0) {
            var id = results[0].id


            connection.beginTransaction(function(err) {
                if (err) {
                    res.json({
                        status: 0,
                        message: "updation failed"
                    });

                }
                connection.query("update  users set is_active='" + is_active + "' where id='" + id + "'", function(err, result) {
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                    }



                connection.query("update  profile_details set name='" + agentname + "' ,primary_mobile='" + mobile + "' ,alternate_mobile='" + alternate_mobile + "',landline_number='"+landline_number+"', email='" + email + "' ,job_title='" + job_title + "',company_name='" + company_name + "',company_address='" + company_address + "', currently_employed='" + currently_employed + "',gender='" + gender + "' where user_id='" + id + "'", function(err, result) {
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
        });
        } else {
            res.json({
                status: 0,
                message: "updation failed"
            });
        }
    });


});

router.post('/editagents', function(req, res) {


    agent_id = req.body.Agent_id
    console.log(agent_id)
    connection.query("select pd.job_title as job_title,pd.name as Name,pd.email as Email,pd.alternate_mobile as whatsup_number,pd.currently_employed as currently_employed,pd.basic_education as basic_education,pd.gender as gender,DATE_FORMAT(pd.dob, '%d/%m/%Y') as dob,pd.primary_mobile as Mobile,pd.company_name as company_name,pd.company_address as company_address ,pd.name as sub_name,a.housename,a.street,a.pincode as pincode,a.district,c.name as country,c.id as country_id,st.name as state,st.id as state_id from users u inner join profile_details pd on pd.user_id=u.id inner join address a on a.user_id=u.id inner join countries c on c.id=a.country_id inner join states st on st.id=a.state_id  where u.agent_id='" + agent_id + "'", function(error, results, fields) {


        if (error) {
            console.log(error)
            res.json({
                status: 0,
                message: 'there are some error with query'
            })


        } else {


            if (results.length > 0) {

                res.json({
                    status: 1,
                    message: 'Agents retreived successfully',
                    packages: results

                })
            } else {
                res.json({
                    status: 0,
                    message: "Failed to retreive Books"
                });
            }


        }
        res.end();

    });

});


router.patch('/packageedit', function(req, res) {

    package_id = req.body.package_id
    package_name = req.body.package_name
    start_month = req.body.Start_month
    no_of_months = req.body.no_of_months
    valid_from = req.body.Valid_from
    valid_to = req.body.Valid_to
    package_description = req.body.Description
    package_amount = req.body.fees
        // package_status=req.body.package_status

    connection.query('update package set name=? ,description=?,fee=?,valid_from=?,valid_to=?,start_month=?,no_of_months=? where id=?', [package_name, package_description, package_amount, valid_from, valid_to, start_month, no_of_months, package_id], function(error, results, fields) {
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

router.patch('/bookedit', function(req, res) {

    title = req.body.title;
    description = req.body.description;
    published_date = req.body.published_date;
    book_id = req.body.book_id;

    connection.query('update books set title=? ,description=?,published_date=? where id=?', [title, description, published_date, book_id], function(error, results, fields) {
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

router.delete('/packagedelete/:id', function(req, res) {

    package_id = req.params.id

    // package_status=req.body.package_status


    connection.query('delete from  package_books  where package_id=?', [package_id], function(error, results, fields) {
        if (error) {
            console.log(error)
            res.json({
                status: false,
                message: 'there are some error with query'
            })



        } else {

           
    connection.query('delete from  package  where id=?', [package_id], function(error, results, fields) {
        if (error) {
            console.log(error)
            res.json({
                status: false,
                message: 'there are some error with query'
            })



        } else {

            res.json({
                status: 1,
                message: 'deleted successfully',


            })

        }
      //  res.end();

    });


        }
        //res.end();

    });


});

router.delete('/bookdelete/:id', function(req, res) {

    book_id = req.params.id
    console.log(book_id)
        // package_status=req.body.package_status

    connection.query('delete from  books  where id=?', [book_id], function(error, results, fields) {
        if (error) {
            console.log(error)
            res.json({
                status: false,
                message: 'there are some error with query'
            })


        } else {

            res.json({
                status: 1,
                message: 'deleted successfully',


            })

        }
        res.end();

    });


});
router.delete('/bookreleasedelete/:id', function(req, res) {

    book_id = req.params.id
    console.log(book_id)
        // package_status=req.body.package_status

    connection.query("delete from books_release where id=?", [book_id], function(error, results, fields) {
        if (error) {
            console.log(error)
            res.json({
                status: 0,
                message: 'there are some error with query'
            })


        } else {

            res.json({
                status: 1,
                message: 'deleted successfully',


            })

        }
        res.end();

    });


});
router.delete('/agentdelete/:id', function(req, res) {

    id = req.params.id


    // package_status=req.body.package_status

    connection.query("delete from profile_details where user_id='" + id + "'", function(error, results, fields) {
        if (error) {
            console.log(error)
            res.json({
                status: false,
                message: 'there are some error with query'
            })


        } else {
            connection.query("delete from address where user_id='" + id + "'", function(error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({
                        status: false,
                        message: 'there are some error with query'
                    })


                } else {
                    connection.query("delete from users where id='" + id + "'", function(error, results, fields) {

                        if (error) {
                            console.log(error)
                            res.json({
                                status: false,
                                message: 'there are some error with query'
                            })


                        } else {
                            res.json({
                                status: 1,
                                message: 'deleted successfully',


                            })

                        }

                    });
                }


            });
        }


    });


});

module.exports = router;