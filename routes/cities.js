var express = require('express')
var router = express.Router()

var CityModel = require('../models/cities')
var DeleteModel = require('../models/delete')


router.get('/cities', (req, res) => {
    CityModel.get()
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});


router.post('/cities', (req, res) => {
    CityModel.create({ newcity: req.body.newcity })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});


router.put('/cities', (req, res) => {
    CityModel.edit({ editcity: req.body.newcity, id:req.body.id   })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});

router.delete('/cities', (req, res) => {
    DeleteModel.delete({ query: req.query })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});



module.exports = router