var express = require('express');
var router = express.Router();
var ClientModel = require('../models/clientlist');
var DeleteModel = require('../models/delete')

router.get('/clients', (req, res) => {
    ClientModel.get()
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});


router.put('/clients', (req, res) => {
    ClientModel.edit({ name: req.body.name, email: req.body.email, city: req.body.city, id: req.body.id})
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});

router.delete('/clients', (req, res) => {
    DeleteModel.delete({ query: req.query })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});



module.exports = router;