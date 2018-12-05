var express = require('express');
var router = express.Router();
var ProductModel = require('../models/product')




router.get('/product', (req, res) => {
    ProductModel.get()
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});


router.post('/product', (req, res) => {
    ProductModel.create({ body: req.body})
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});

router.put('/product', (req, res) => {
    ProductModel.edit({ body: req.body })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});




module.exports = router;