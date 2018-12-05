const mysql = require('mysql')
const mypool = require('../settings/MyPool')

const cities = {


  get: () => {
    return mypool.getCon()
      .then((con) => {
        const sql = 'SELECT * FROM citys';

        return new Promise((resolve, reject) => {
          con.query(sql, function (err, result) {
            if (err) {
              reject(err);
              return;
            }

            resolve({ result: result, con: con });
          })
        });
      });
  },

  create: ({ newcity }) => {
    return mypool.getCon()
      .then(con => {
        const sql = `INSERT INTO citys (city) VALUES (${mysql.escape(newcity)})`;

        return new Promise((resolve, reject) => {
          con.query(sql, (err, result) => {
            if (err) {
              return reject(err);
            }

            resolve(result);
          })
        });
      });
  }

}

/*
var promise = new Promise(mypool.getCon);
                promise.then((con) => {
                    var sql = "INSERT INTO citys (city) VALUES ("
                        + mysql.escape(req.body.newcity) + ")";
                    con.query(sql, function (err, result) {
                        if (err) {
                            reject({ success: false, error: err, data: 'trouble of database' });
                            return;
                        }
                        resolve({ success: true, error: false, data: result });
                    });
                })
 */


/*
new mypool().getCon((con) => {
            var sql = 'SELECT * FROM citys';
            con.query(sql, function (err, result) {
                if (err) {
                    return new Object({success: false, error: true, data: 'trouble of database'});
                }
                console.log('resuult',result)
                return new Object({success: true, error: false, data: result});
            });
        });
 */

module.exports = cities;