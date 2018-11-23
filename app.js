const config = require('./settings/config');
var protected = require('./routes/protected');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

const citys = require('./routes/citys') ;
const masters = require('./routes/masters') ;
const orders = require('./routes/orders') ;


var app = express();
var port = process.env.PORT || config.BACK_END_PORT;




app.use(bodyParser.json());
app.use(cors(config.CORS_OPTIONS));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/protected', protected);
app.post('/login', protected.authenticate);
app.post('/citys',citys) ;
app.post('/letmasters',masters);
app.post('/pushorder',orders);



app.listen(port, function() {
	console.log('Example app listening on port ' + port + ' !');
});