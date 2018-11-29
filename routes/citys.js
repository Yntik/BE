const config = require('../settings/config');
var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var jwt = require('jsonwebtoken');
var cors = require('cors');
const MYSQL = require('../settings/MYSQL');

router.use(cors(config.CORS_OPTIONS));


router.get('/city', function(req, res) {
   new MYSQL().getCon((con) =>{
        var sql = 'SELECT * FROM citys';
        con.query(sql, function (err, result) {
            if (err) {
                res.status(501).json({success: false, error: true, data: 'truoble of database'});
                return;
            }
            res.status(200).json({success: true, error: false, data: result});
        });
    });
});


router.post('/city', function(req, res) {
    new MYSQL().getCon((con) => {
        var sql = "INSERT INTO citys (city) VALUES ("
            + mysql.escape(req.body.newcity) + ")";
        con.query(sql, function (err, result) {
            if (err) {
                res.status(501).json({ success: false, error: true, data: 'truble of database' });
                    return ;
                }
                res.status(200).json({ success: true, error: false, data: result });

            });
        });
});


router.put('/city' , function(req, res) {
    new MYSQL().getCon((con) => {
        var sql = 'UPDATE citys SET city = ? WHERE id = ?';
        con.query(sql, [
            req.body.newcity,
            req.body.id
        ], function (err, result) {
            if (err) {
                res.status(501).json({ success: false, error: true, data: 'trouble of database' });
                return ;
            }
            res.status(200).json({ success: true, error: false, data: result });

        });
    });
});




module.exports = router;