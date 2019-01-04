const config = require('../settings/config');
var express = require('express');
var router = express.Router();
var cors = require('cors');
var jwt = require('jsonwebtoken');
var mysql = require('mysql');

const masters = require('./masters');
const citys = require('./cities');
const price = require('./product')
const orders = require('./orders');
const clients = require('./clientlist');


router.get('/masters', masters);
router.post('/masters', masters);
router.put('/masters', masters);
router.delete('/masters', masters);


router.post('/cities', citys);
router.put('/cities', citys);
router.delete('/cities', citys);


router.post('/product', price);
router.put('/product', price);
router.delete('/product', price);


router.get('/orders', orders);
router.put('/orders', orders);
router.delete('/orders', orders);

router.get('/clients', clients);
router.put('/clients', clients);
router.delete('/clients', clients);



router.use(cors(config.CORS_OPTIONS));
// Add new function with name 'authenticate'
router.authenticate = function (req, res) {
    console.log('react');
    var con = mysql.createConnection(config.MYSQL_OPTION);
    var username = req.body.username;
    var password = req.body.password;
    console.log('pass', req.body.password);

    // TODO: connect to remote MySql server
    // check if that username/password pair is valid

    con.connect(function (err) {
        console.log(err, "connected")
        if (err) {
            res.status(501).json({success: false, error: 1, data: 'not connected! to database'});
            ;
            return;
        }
        var sql = 'SELECT * FROM admins WHERE login = ' + mysql.escape(username) + ' AND password = ' + mysql.escape(password) + ';';

        con.query(sql, function (err, result) {
            con.end();
            if (err || result.length == 0) {
                res.status(403).json({success: false, error: 1, data: 'Login failed!'});
                return;
            }
            console.log('result', result);

            // Create new token
            var token = jwt.sign({
                id: result.id,
                username: result.login,
                password: result.password
            }, config.JWT_SECRET_KEY, {
                expiresIn: config.JWT_EXPIRATION_TIME
            });
            res.status(200);
            res.json({success: true, error: 0, data: token});
        });


    });

};


// MIDDLEWARE
router.use(function (req, res, next) {
    var token = req.body.token || req.headers.token;
    if (token) {
        jwt.verify(token, config.JWT_SECRET_KEY, function (err) {
            if (err) {
                res.status(403).json({error: true, data: "Token is invalid"});
            } else {
                next();
            }
        });
    } else {
        res.status(403).json({error: true, data: "Token is invalid"});
    }
});

router.get('/checktoken', function (req, res) {
    var token = req.body.token || req.headers['token'];
    if (token) {
        jwt.verify(token, config.JWT_SECRET_KEY, function (err) {
            if (err) {
                console.log("chektoken verify error");
                res.status(403).json({success: false, error: true, data: "Token is invalid"});
            } else {
                console.log("chektoken okee");
                res.status(200).json({success: true, error: false, data: "Token is valid"});
            }
        });
    } else {
        console.log("chektoken toktn not found")
        res.status(403).json({success: false, error: true, data: "Token is invalid"});
    }
});


router.delete('/delete', function (req, res) {
    console.log('delete init');

    var arrayValidation = ['masters', 'citys', 'orders', 'clients', 'product'];
    if (arrayValidation.indexOf(req.query.route) === -1) {
        res.status(403).json({success: false, error: true, data: 'operation of remove not possible'});
        return;
    }
    var con = mysql.createConnection(config.MYSQL_OPTION);
    con.connect(function (err) {
        if (err) {
            res.status(501).json({success: false, error: 1, data: 'not connected! to database'});
            return;
        }
        var sql = "DELETE FROM "
            + req.query.route
            + " WHERE id = " + mysql.escape(Number(req.query.id));
        console.log(sql);
        con.query(sql, function (err, result) {
            con.end();
            if (err) {
                console.log(err)
                res.status(501).json({success: false, error: true, data: 'truble of database'});
                return;
            }
            res.status(200).json({success: true, error: false, data: result});
        });
    });
});


module.exports = router;