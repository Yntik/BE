var express = require('express');
var router = express.Router();
var MasterModel = require('../models/masters');
var DeleteModel = require('../models/delete');


router.get('/free-master', (req, res) => {
    console.log('success');
    MasterModel.getFreeMaster({ query: req.query })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});



router.get('/masters', (req, res) => {
    MasterModel.get()
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});
router.post('/masters', (req, res) => {
    MasterModel.create({ body: req.body})
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});

router.put('/masters', (req, res) => {
    MasterModel.edit({ body: req.body })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});

router.delete('/masters', (req, res) => {
    DeleteModel.delete({ query: req.query })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});


module.exports = router;