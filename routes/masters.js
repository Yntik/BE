const config = require('../settings/config');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var cors = require('cors');

router.use(cors(config.CORS_OPTIONS));


router.get('/free-master', function(req, res) {
    var start = new Date(String(req.query.datetime)) ;
    var end = new Date(String(req.query.datetime)) ;
    end.setHours(end.getHours() + Number(req.query.size))

    var con = mysql.createConnection(config.MYSQL_OPTION);
    console.log(req.query);
    con.connect(function(err) {
        if (err) {
            res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
            return ;
        }
        var sql = '';
        if (req.query.option === 'new') {
            console.log('free master for new order');
            sql = 'SELECT masters.id, masters.name, masters.surname, masters.idcity, masters.rating, citys.city\n'
                + "FROM masters\n"
                + "LEFT JOIN citys ON masters.idcity = citys.id\n"
                + "WHERE citys.id = " + mysql.escape(decodeURI(req.query.city)) + "\n"
                + "AND masters.id NOT IN (" +"\n"
                + "SELECT idmaster FROM orders WHERE start <= "  + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" +"\n"
                + "OR start <= "  + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end )" ;
        }
        else {
            sql = 'SELECT masters.id, masters.name, masters.surname, masters.idcity, masters.rating, citys.city\n '
                + "FROM masters\n"
                + "LEFT JOIN citys ON masters.idcity = citys.id\n"
                + "WHERE citys.id = " + mysql.escape(decodeURI(req.query.city)) + "\n"
                + "AND masters.id NOT IN (" +"\n"
                + "SELECT idmaster FROM orders WHERE (start <= "  + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" +"\n"
                + "OR start <= "  + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end) AND NOT orders.id = " + mysql.escape(Number(req.query.option)) + ")" ;
        }
        console.log('sql--->', sql)
        con.query(sql, function (err, result) {
			con.end() ;
            if (err) {
                console.log('err',err) ;
                res.status(501).json({ success: false, error: true, data: 'truble of database' });
                return ;
            }
            console.log('result', result)
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
        //var sql = 'SELECT * FROM masters' ;
        var sql = 'SELECT masters.id, masters.name, masters.surname, masters.rating, masters.idcity, citys.city\n '
            + "FROM masters\n"
            + "LEFT JOIN citys ON masters.idcity = citys.id\n"
            + "ORDER BY masters.rating DESC" ;
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
    console.log(req.body);
    var con = mysql.createConnection(config.MYSQL_OPTION);
    con.connect(function(err) {
        if (err) {
            res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
            return ;
        }
        var sql = "INSERT INTO masters (name, surname, rating, idcity) VALUES ("
            + mysql.escape(req.body.name) + ','
            + mysql.escape(req.body.surname) + ','
            + mysql.escape(req.body.rating) + ','
            + mysql.escape(req.body.city) + ")";
        con.query(sql, function (err, result) {
			con.end() ;
            if (err) {
                console.log(err)
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
        var sql = 'UPDATE masters SET name = ?, surname = ?, rating = ?, idcity = ? WHERE id = ?';
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