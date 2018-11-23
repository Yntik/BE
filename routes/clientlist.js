const config = require('../settings/config');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mysql = require('mysql') ;
var cors = require('cors');

router.use(cors(config.CORS_OPTIONS));


router.post('/clientlist', function(req, res) {
    var con = mysql.createConnection(config.MYSQL_OPTION);
    con.connect(function(err) {
        if (err) {
            res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
            return ;
        }
        var sql = 'SELECT * FROM clients' ;
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


router.put('/editclient' , function(req, res) {
    var con = mysql.createConnection(config.MYSQL_OPTION);
    console.log('edit client init') ;
    console.log(req.body) ;
    con.connect(function(err) {
        if (err) {
            res.status(501).json({ success: false, error: 1, data: 'not connected! to database' });
            return ;
        }
        var sql = 'UPDATE clients SET name = ?, email = ?, city = ? WHERE id = ?';
        console.log(sql) ;
        con.query(sql, [
            req.body.name,
            req.body.email,
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