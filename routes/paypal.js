var express = require('express')
var router = express.Router()




router.post('/paypal', (req, res) => {
    console.log('body!!!!',req.body);
    res.status(200);
});




module.exports = router