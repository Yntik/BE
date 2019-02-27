const config = require('../settings/config');
const auth0_Options = require('../settings/auth0');
const express = require('express');
const router = express.Router();
const cors = require('cors');
const mysql = require('mysql');

const masters = require('./masters');
const citys = require('./cities');
const price = require('./product');
const orders = require('./orders');
const clients = require('./clientlist');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

let jwtCheck = jwt({
	secret: jwks.expressJwtSecret(auth0_Options.expressJwtSecret),
	audience: auth0_Options.audience,
	issuer: auth0_Options.issuer,
	algorithms: auth0_Options.algorithms
});

router.use(jwtCheck);

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








router.get('/checktoken', function (req, res) {
	console.log('checkToken');
	res.status(200).json({success: true, error: false, data: 'Token is valid'});
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
		var sql = 'DELETE FROM '
            + req.query.route
            + ' WHERE id = ' + mysql.escape(Number(req.query.id));
		console.log(sql);
		con.query(sql, function (err, result) {
			con.end();
			if (err) {
				console.log(err);
				res.status(501).json({success: false, error: true, data: 'truble of database'});
				return;
			}
			res.status(200).json({success: true, error: false, data: result});
		});
	});
});


module.exports = router;