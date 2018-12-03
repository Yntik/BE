var MyPool = require('mysql');
var config = require('./MYSQL_OPTION');

var pool = MyPool.createPool(config.POOL_OPTION);

let MySQL = {


    getCon: function (resolve, reject) {
        pool.getConnection(function (err, con) {
            if (err) {
                console.log(err);
                reject(err);
                callback(true);
            }
            resolve(con)
        })

    }
}


module.exports = MySQL;