var express = require('express');
var router = express.Router();
var MasterModel = require('../models/masters');


router.get('/free-master', (req, res) => {
    MasterModel.getFreeMaster({ query: req.query })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});



router.get('/master', (req, res) => {
    MasterModel.get()
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});
router.post('/master', (req, res) => {
    MasterModel.create({ body: req.body})
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});

router.put('/master', (req, res) => {
    MasterModel.edit({ body: req.body })
        .then(result => res.status(200).json({ success: true, error: false, data: result }))
        .catch(err => res.status(501).json({ success: false, error: true, data: err }));
});



module.exports = router;