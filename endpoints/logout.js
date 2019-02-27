const express = require('express');
const router = express.Router();


router.post('/logout', (req, res) => {
	console.log('logout', req.body);
	res.status(200);
});



module.exports = router;