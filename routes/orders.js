const config = require('../settings/config');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mysql = require('mysql') ;
var cors = require('cors');
var nodemailer = require('nodemailer') ;

router.use(cors(config.CORS_OPTIONS));


router.post('/pushorder', function(req, res) {
    if (req.body.client.length < 3) {
        res.status(403).json({ success: false, error: true, data: 'not validation' });
        return
    }

    else if (!(req.body.size > 0 && req.body.size <= 3) ) {
        res.status(403).json({ success: false, error: true, data: 'not validation' });
        return
    }



    var con = mysql.createConnection(config.MYSQL_OPTION);
    con.connect(function(err) {
        if (err) {
            res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
            return ;
        }
        var sql = "SELECT * FROM masters\n"
            + "WHERE masters.name = "
            + mysql.escape(req.body.master.name) + " AND "
            + "masters.surname = "
            + mysql.escape(req.body.master.surname) + ' AND '
            + "masters.rating = "
            + mysql.escape(req.body.master.rating) + ' AND '
            + "masters.city = "
            + mysql.escape(req.body.master.city) + " ;";
        console.log(sql) ;
        con.query(sql, function (err, result) {
            con.end() ;
            if (err) {
                res.status(501).json({ success: false, error: true, data: 'truble of database' });
                return ;
            }
            else if (result.length === 0) {
                res.status(403).json({ success: false, error: true, data: 'Master not found' });
                return
            }


            var start = new Date(req.body.datetime) ;
            var end = new Date(req.body.datetime) ;
            end.setHours(end.getHours() + Number(req.body.size)) ;


            con = mysql.createConnection(config.MYSQL_OPTION);
            con.connect(function(err) {
                if (err) {
                    res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
                    return ;
                }
                var sql = "SELECT * FROM orders\n"
                    +"WHERE idmaster = " + mysql.escape(Number(req.body.master.id)) + " AND (start <= "  + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" +"\n"
                    + "OR start <= "  + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end)" ;
                con.query(sql, function (err, result) {
                    con.end() ;
                    if (err) {
                        res.status(501).json({ success: false, error: true, data: 'truble of database' });
                        return ;
                    }
                    else if (result.length !== 0) {
                        res.status(403).json({ success: false, error: true, data: 'Master not found' });
                        return
                    }


            console.log('chack master2') ;
            con = mysql.createConnection(config.MYSQL_OPTION);
            con.connect(function(err) {
                if (err) {
                    res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
                    return ;
                }
                var sql = "INSERT INTO orders (client, email, size, city, idmaster, start, end) VALUES (\n"
                    + mysql.escape(req.body.client) + ','
                    + mysql.escape(req.body.email) + ','
                    + mysql.escape(req.body.size) + ','
                    + mysql.escape(req.body.city) + ','
                    + mysql.escape(Number(req.body.master.id)) + ','
                    + mysql.escape(start) + ','
                    + mysql.escape(end) + ") ;" ;
                con.query(sql, function (err, result) {
                    con.end() ;
                    if (err) {
                        res.status(501).json({ success: false, error: true, data: 'truble of database_1' });
                        return ;
                    }
                    con = mysql.createConnection(config.MYSQL_OPTION);
                    if (err) {
                        res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
                        return ;
                    }
                    console.log(result) ;
                    var sql = "INSERT INTO clients (name, email, city) VALUES (\n"
                        + mysql.escape(req.body.client) + ','
                        + mysql.escape(req.body.email) + ','
                        + mysql.escape(req.body.city) + ")\n"
                        + "ON DUPLICATE KEY UPDATE\n"
                        + "name = "+ mysql.escape(req.body.client) + ','
                        + "city = " +mysql.escape(req.body.city) ;
                    con.query(sql, function (err, result) {
                        con.end() ;
                        if (err) {
                            console.log('err',err) ;
                            res.status(501).json({ success: false, error: true, data: 'truble of database_2' });
                            return ;
                        }
                        var transporter = nodemailer.createTransport({
                            service: 'Gmail',
                            auth: {
                                user: 'clockwiseclockware@gmail.com',
                                pass: 'passwordsecret'
                            }
                        });
                        console.log('created');
                        transporter.sendMail({
                            from: 'clockwiseclockware@gmail.com',
                            to: req.body.email,
                            subject: 'Заказ принят!',
                            text: 'Ваш заказ поступил в обработку!'
                        });
                        res.status(200).json({ success: true, error: false, data: result });

                        });
                    });
                });


            });
        });
        });
    });
});


router.post('/getorders', function(req, res) {
    var con = mysql.createConnection(config.MYSQL_OPTION);
    con.connect(function(err) {
        if (err) {
            res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
            return ;
        }
        var sql = 'SELECT masters.name, orders.id, orders.client, orders.email, orders.size, orders.city, orders.idmaster, orders.start, orders.end\n '
            + "FROM orders\n"
            + "LEFT JOIN masters ON orders.idmaster = masters.id\n "
            + "ORDER BY orders.start DESC"

        con.query(sql, function (err, result) {
            con.end() ;
            if (err) {
                res.status(501).json({ success: false, error: true, data: 'truble of database' });
                return ;
            }
            res.status(200).json({ success: true, error: false, data: result });
        });
    });
});

router.put('/editorder' , function(req, res) {
    var start = new Date(req.body.datetime) ;
    var end = new Date(req.body.datetime) ;
    end.setHours(end.getHours() + Number(req.body.size))
    var con = mysql.createConnection(config.MYSQL_OPTION);
    con.connect(function(err) {
        if (err) {
            res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
            return ;
        }
        var sql = 'UPDATE orders SET client = ?, email = ?, size = ?, city = ?, idmaster = ?, start = ?, end = ?  WHERE id   = ?';
        con.query(sql, [
            req.body.client,
            req.body.email,
            req.body.size,
            req.body.city,
            req.body.idmaster,
            start,
            end,
            req.body.id
        ], function (err, result) {
            con.end() ;
            if (err) {
                res.status(501).json({ success: false, error: true, data: 'truble of database' });
                return ;
            }
            res.status(200).json({ success: true, error: false, data: result });

        });
    });
});





module.exports = router;