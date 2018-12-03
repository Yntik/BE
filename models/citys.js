var mysql = require('mysql');
var mypool = require('../settings/MyPool');

let citys = {


    get: function(resolve, reject){
        var promise = new Promise(mypool.getCon);
        promise.then((con) =>{
            var sql = 'SELECT * FROM citys';
            con.query(sql, function (err, result) {
                if (err) {
                    reject({success: false, error: err, data: 'trouble of database'});
                    return;
                }
                resolve({success: true, error: false, data: result});
            });
        })
    },

    post: function (resolve, reject) {
        var promise = new Promise(mypool.getCon);
        promise.then((con) => {
            var sql = "INSERT INTO citys (city) VALUES ("
                + mysql.escape(req.body.newcity) + ")";
            con.query(sql, function (err, result) {
                if (err) {
                    reject({ success: false, error: err, data: 'trouble of database' });
                }
                resolve({ success: true, error: false, data: result });
            });
        })
    }

};

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

module.exports = citys ;