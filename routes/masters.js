const config = require('../settings/config');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mysql = require('mysql') ;
var cors = require('cors');

router.use(cors(config.CORS_OPTIONS));


router.get('/getfreemasters', function(req, res) {
    var start = new Date(req.headers.datetime) ;
    var end = new Date(req.headers.datetime) ;
    end.setHours(end.getHours() + Number(req.headers.size))
    var con = mysql.createConnection(config.MYSQL_OPTION);
    con.connect(function(err) {
        if (err) {
            res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
            return ;
        }
        var sql = "SELECT * FROM masters WHERE masters.city = " + mysql.escape(decodeURI(req.headers.city)) +"\n"
            + "AND id NOT IN (" +"\n"
            + "SELECT idmaster FROM orders WHERE start <= "  + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" +"\n"
            + "OR start <= "  + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end)" ;
        con.query(sql, function (err, result) {
			con.end() ;
            if (err) {
                console.log('err',err) ;
                res.status(501).json({ success: false, error: true, data: 'truble of database' });
                return ;
            }
            res.status(200).json({ success: true, error: false, data: result });

        });
    });
});


router.get('/master', function(req, res) {
    var con = mysql.createConnection(config.MYSQL_OPTION);
    con.connect(function(err) {
        if (err) {
            res.status(501).json({ success: false, error: true, data: 'not connected! to database' });
            return ;
        }
        var sql = 'SELECT * FROM masters' ;
        con.query(sql, function (err, result) {
			con.end() ;
            if (err) {
                res.status(501).json({ success: false, error: true, data: 'truble of database' });
                return ;
            }
            res.status(200).json({ success: false, error: true, data: result });
        });
    });
});

router.post('/master', function(req, res) {
    var con = mysql.createConnection(config.MYSQL_OPTION);
    con.connect(function(err) {
        if (err) {
            res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
            return ;
        }
        var sql = "INSERT INTO masters (name, surname, rating, city) VALUES ("
            + mysql.escape(req.body.name) + ','
            + mysql.escape(req.body.surname) + ','
            + mysql.escape(req.body.rating) + ','
            + mysql.escape(req.body.city) + ")";
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

router.put('/master' , function(req, res) {
    var con = mysql.createConnection(config.MYSQL_OPTION);
    con.connect(function(err) {
        if (err) {
            res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
            return ;
        }
        var sql = 'UPDATE masters SET name = ?, surname = ?, rating = ?, city = ? WHERE id   = ?';
        con.query(sql, [
            req.body.name,
            req.body.surname,
            req.body.rating,
            req.body.city,
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