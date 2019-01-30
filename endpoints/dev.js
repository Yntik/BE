var express = require('express')
var router = express.Router()

router.get('/dev', (req, res) => {
    process.nextTick(function () {
        throw new Error;
    });
});

module.exports = router;