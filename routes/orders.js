var express = require('express');
var router = express.Router();
var OrderModel = require('../models/orders');
var DeleteModel = require('../models/delete');


router.get('/orders', (req, res) => {
    OrderModel.get()
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});

router.post('/orders', (req, res) => {
    console.log(req.body);
    OrderModel.create({ body: req.body })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});




router.put('/orders' , function(req, res) {
    OrderModel.edit({ body: req.body })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});

router.delete('/orders', (req, res) => {
    OrderModel.deleteOrder({ req: req})
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});



module.exports = router;