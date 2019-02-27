const express = require('express');
const router = express.Router();

const ClientModel = require('../controllers/clients');


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
	ClientModel.delete({ query: req.query })
		.then(result => res.status(200).json({ success: true, error: false, data: result }))
		.catch(err => res.status(501).json({ success: false, error: true, data: err }));
});



module.exports = router;