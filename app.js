const config = require('./settings/config');
var protected = require('./endpoints/protected');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

const citys = require('./endpoints/cities');
const price = require('./endpoints/product');
const masters = require('./endpoints/masters');
const orders = require('./endpoints/orders');
const paypal = require('./endpoints/paypal');
const logout = require('./endpoints/logout');

var app = express();
var port = process.env.PORT || config.BACK_END_PORT;



app.use(bodyParser.json());
app.use(cors(config.CORS_OPTIONS));
app.use(bodyParser.urlencoded({
    extended: false
}));






app.use('/protected', protected);
// app.post('/login', protected.authenticate);
app.post('/logout',logout) ;
app.get('/cities',citys) ;
app.get('/product',price) ;
app.get('/free-master',masters);
app.post('/orders',orders);
app.post('/paypal',paypal);
app.post('/paypal/delete',paypal);



app.listen(port, function() {
	console.log('Example app listening on port ' + port + ' !');
});