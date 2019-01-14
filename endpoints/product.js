const express = require('express');
const router = express.Router();
const ProductModel = require('../controllers/products');




router.get('/product', (req, res) => {
    console.log('get products');
    ProductModel.get()
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});


router.post('/product', (req, res) => {
    ProductModel.create({ body: req.body})
        .then(result => res.status(201).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});

router.put('/product', (req, res) => {
    ProductModel.edit({ body: req.body })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});

router.delete('/product', (req, res) => {
    ProductModel.delete({ query: req.query })
        .then(result => res.status(204).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});


module.exports = router;