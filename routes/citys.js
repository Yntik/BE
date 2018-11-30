var express = require('express');
var router = express.Router();
var mysql = require('../models/citys');





router.get('/city', function(req, res) {
    var promise = new Promise(mysql.getCitys);
    promise.then((onfulfilled) => {
        res.status(200).json(onfulfilled);
    });
    promise.catch((onfulfilled) => {
        res.status(501).json(onfulfilled);
    });
});


router.post('/city', function(req, res) {
    new mypool().getCon((con) => {
        var sql = "INSERT INTO citys (city) VALUES ("
            + mysql.escape(req.body.newcity) + ")";
        con.query(sql, function (err, result) {
            if (err) {
                res.status(501).json({ success: false, error: true, data: 'trouble of database' });
                    return ;
                }
                res.status(200).json({ success: true, error: false, data: result });

            });
        });
});


router.put('/city' , function(req, res) {
    new mypool().getCon((con) => {
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