var express = require('express')
var router = express.Router()

const CityModel = require('../models/citys')


router.get('/city', (req, res) => {
  CityModel.get()
    .then(result => res.status(200).json({ success: true, error: false, data: result }))
    .catch(err => res.status(501).json({ success: false, error: true, data: err }));
})


router.post('/city', (req, res) => {
  CityModel.create({ newcity: req.body.newcity })
    .then(result => res.status(200).json({ success: true, error: false, data: result }))
    .catch(err => res.status(501).json({ success: false, error: true, data: err }));
})

/*
new mypool().getCon((con) => {
        var sql = "INSERT INTO citys (city) VALUES ("
            + mysql.escape(req.body.newcity) + ")";
        con.query(sql, function (err, result) {
            if (err) {
                res.status(501).json({ success: false, error: true, data: 'trouble of database' });
                    return ;
                }
                res.status(200).json({ success: true, error: false, data: result });

            });
        });
 */

router.put('/city', function (req, res) {
  new mypool().getCon((con) => {
    var sql = 'UPDATE citys SET city = ? WHERE id = ?'
    con.query(sql, [
      req.body.newcity,
      req.body.id
    ], function (err, result) {
      if (err) {
        res.status(501).json({ success: false, error: true, data: 'trouble of database' })
        return
      }
      res.status(200).json({ success: true, error: false, data: result })

    })
  })
})


module.exports = router