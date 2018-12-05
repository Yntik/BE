const config = require('../settings/config');
var express = require('express');
var router = express.Router();
var OrderModel = require('../models/orders')
var nodemailer = require('nodemailer') ;
var cors = require('cors');
router.use(cors(config.CORS_OPTIONS));


router.get('/order', (req, res) => {
    OrderModel.get()
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});

router.post('/order', (req, res) => {
    OrderModel.create({ body: req.body })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});


// router.post('/order', function(req, res) {
//     if (req.body.client.length < 3) {
//         res.status(403).json({ success: false, error: true, data: 'not validation' });
//         return
//     }
//
//     else if (!(req.body.size > 0 && req.body.size <= 3) ) {
//         res.status(403).json({ success: false, error: true, data: 'not validation' });
//         return
//     }
//
//
//
//     var con = mysql.createConnection(config.MYSQL_OPTION);
//     con.connect(function(err) {
//         if (err) {
//             res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
//             return ;
//         }
//         var sql = "SELECT * FROM masters\n"
//             + "WHERE masters.name = "
//             + mysql.escape(req.body.master.name) + " AND "
//             + "masters.surname = "
//             + mysql.escape(req.body.master.surname) + ' AND '
//             + "masters.rating = "
//             + mysql.escape(req.body.master.rating) + ' AND '
//             + "masters.idcity = "
//             + mysql.escape(req.body.master.idcity) + " ;";
//         console.log(sql) ;
//         con.query(sql, function (err, result) {
//             con.end() ;
//             if (err) {
//                 res.status(501).json({ success: false, error: true, data: 'trouble of database' });
//                 return ;
//             }
//             else if (result.length === 0) {
//                 res.status(403).json({ success: false, error: true, data: 'Master not found' });
//                 return
//             }
//
//
//             var start = new Date(req.body.datetime) ;
//             var end = new Date(req.body.datetime) ;
//             end.setHours(end.getHours() + Number(req.body.size)) ;
//
//
//             con = mysql.createConnection(config.MYSQL_OPTION);
//             con.connect(function(err) {
//                 if (err) {
//                     res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
//                     return ;
//                 }
//                 var sql = "SELECT * FROM orders\n"
//                     +"WHERE idmaster = " + mysql.escape(Number(req.body.master.id)) + " AND (start <= "  + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" +"\n"
//                     + "OR start <= "  + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end)" ;
//                 con.query(sql, function (err, result) {
//                     con.end() ;
//                     if (err) {
//                         res.status(501).json({ success: false, error: true, data: 'truble of database' });
//                         return ;
//                     }
//                     else if (result.length !== 0) {
//                         res.status(403).json({ success: false, error: true, data: 'Master not found' });
//                         return;
//                     }
//
//                     console.log('chack master2') ;
//                     con = mysql.createConnection(config.MYSQL_OPTION);
//                     con.connect(function(err) {
//                         if (err) {
//                             res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
//                             return ;
//                         }
//                         /* Begin transaction */
//                         con.beginTransaction(function(err) {
//                             if (err) {
//                                 res.status(501).json({ success: false, error: true, data: 'trouble of database(1)' });
//                                 return ;
//                             }
//                             sql =  "INSERT INTO clients (name, email, idcity) VALUES (\n"
//                                 + mysql.escape(req.body.client) + ', '
//                                 + mysql.escape(req.body.email) + ', '
//                                 + req.body.city + ")\n"
//                                 + "ON DUPLICATE KEY UPDATE\n"
//                                 + "name = "+ mysql.escape(req.body.client) + ',\n'
//                                 + "idcity =" +req.body.city + ";\n" ;
//                             con.query(sql,function(err, result) {
//                                 if (err) {
//                                     con.rollback(function() {
//                                         res.status(501).json({ success: false, error: true, data: 'trouble of database(2)' });
//                                         return;
//                                     });
//                                 }
//
//                                 var log = result.insertId;
//                                 sql = "INSERT INTO orders (idclient, price, idproduct, idcity, idmaster, start, end) VALUES (\n"
//                                     + mysql.escape(log) + ','
//                                     + mysql.escape(req.body.price) + ','
//                                     + mysql.escape(Number(req.body.size)) + ','
//                                     + mysql.escape(Number(req.body.city)) + ','
//                                     + mysql.escape(Number(req.body.master.id)) + ','
//                                     + mysql.escape(start) + ','
//                                     + mysql.escape(end) + ");\n"
//                                 con.query(sql, function(err, result) {
//                                     if (err) {
//                                         con.rollback(function() {
//                                             res.status(501).json({ success: false, error: true, data: 'trouble of database(3)' });
//                                             return;
//                                         });
//                                     }
//                                     con.commit(function(err) {
//                                         if (err) {
//                                             con.rollback(function() {
//                                                 return reject(err);
//                                             });
//                                         }
//                                         console.log('Transaction Complete.');
//                                     });
//                                 });
//                             });
//                         });
//                         /* End transaction */
//                         console.log(sql);
//                         var transporter = nodemailer.createTransport({
//                             service: 'Gmail',
//                             auth: {
//                                 user: 'clockwiseclockware@gmail.com',
//                                 pass: 'passwordsecret'
//                             }
//                         });
//                         console.log('created');
//                         transporter.sendMail({
//                             from: 'clockwiseclockware@gmail.com',
//                             to: req.body.email,
//                             subject: 'Заказ принят!',
//                             text: 'Ваш заказ поступил в обработку!'
//                         });
//                         res.status(200).json({ success: true, error: false, data: result });
//                     });
//                 });
//             });
//         });
//     });
// });


router.put('/order' , function(req, res) {
    console.log(req.body);
    var start = new Date(req.body.datetime) ;
    var end = new Date(req.body.datetime) ;
    end.setHours(end.getHours() + Number(req.body.size))
    var con = mysql.createConnection(config.MYSQL_OPTION);
    con.connect(function(err) {
        if (err) {
            res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
            return ;
        }
        /* Begin transaction */
        con.beginTransaction(function(err) {
            if (err) {
                res.status(501).json({ success: false, error: true, data: 'trouble of database(1)' });
                return ;
            }
            var sql = 'UPDATE clients SET name = ?, email = ?, idcity = ? WHERE id  = ?';
            con.query(sql, [
                req.body.client,
                req.body.email,
                Number(req.body.city),
                 Number(req.body.idclient)
             ], function(err, result) {
                if (err) {
                    con.rollback(function() {
                        res.status(501).json({ success: false, error: true, data: 'trouble of database(2)' });
                        return;
                    });
                }
                sql = 'UPDATE orders SET idclient = ?, idcity = ?, idmaster = ?, price = ?, start = ?, end = ?  WHERE id  = ?';
                con.query(sql, [
                    Number(req.body.idclient),
                    Number(req.body.city),
                    Number(req.body.idmaster),
                    Number(req.body.price),
                    start,
                    end,
                    Number(req.body.id)
                ],function(err, result) {
                    if (err) {
                        con.rollback(function() {
                            res.status(501).json({ success: false, error: true, data: 'trouble of database(3)' });
                            return;
                        });
                    }
                    con.commit(function(err) {
                        if (err) {
                            con.rollback(function() {
                                res.status(501).json({ success: false, error: true, data: 'trouble of database(4)' });
                                return;
                            });
                        }
                        res.status(200).json({ success: true, error: false, data: result });
                        console.log('Transaction Complete.');
                        con.end();
                    });
                });
            });
        });
        /* End transaction */
        // var sql = 'UPDATE orders SET client = ?, email = ?, size = ?, city = ?, idmaster = ?, price = ?, start = ?, end = ?  WHERE id   = ?';
        // con.query(sql, [
        //     req.body.client,
        //     req.body.email,
        //     req.body.size,
        //     req.body.city,
        //     req.body.idmaster,
        //     req.body.price,
        //     start,
        //     end,
        //     req.body.id
        // ], function (err, result) {
        //     con.end() ;
        //     if (err) {
        //         res.status(501).json({ success: false, error: true, data: 'truble of database' });
        //         return ;
        //     }
        //     res.status(200).json({ success: true, error: false, data: result });
        //
        // });
    });
});





module.exports = router;