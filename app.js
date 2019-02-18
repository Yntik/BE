const config = require('./settings/config');
const protected = require('./endpoints/protected');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const citys = require('./endpoints/cities');
const price = require('./endpoints/product');
const masters = require('./endpoints/masters');
const orders = require('./endpoints/orders');
const paypal = require('./endpoints/paypal');
const logout = require('./endpoints/logout');
const dev = require('./endpoints/dev');

const app = express();
const port = process.env.PORT || config.BACK_END_PORT;



app.use(bodyParser.json());
app.use(cors(config.CORS_OPTIONS));
app.use(bodyParser.urlencoded({
    extended: false
}));





app.use('/protected', protected);
app.post('/logout',logout);
app.get('/dev',dev);
app.get('/cities',citys);
app.get('/product',price);
app.get('/free-master',masters);
app.post('/orders',orders);
app.post('/paypal',paypal);
app.post('/paypal/delete',paypal);



app.listen(port, function() {
	console.log('Example app listening on port ' + port + ' !');
	console.log(config.DATABASE);
});
