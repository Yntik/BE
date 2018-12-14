var express = require('express')
var router = express.Router()
var paypalModel = require('../models/paypal/paypal')


router.post('/paypal3', (req, res) => {
    console.log('request ++');
    console.log(typeof req.body);
    /*console.log('headers', req.headers);*/
    paypalModel.verify({req: req})
        .then(resolve => {
            console.log(resolve);
            paypalModel.stateChange({body: req.body})
                .then(result => res.status(200).json({success: true, error: false, data: result}))

        })
        .catch(err =>  res.status(501).json({success: false, error: true, data: err}));

});


module.exports = router