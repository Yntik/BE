var MyPool = require('mysql')
var config = require('./MYSQL_OPTION')

var pool = MyPool.createPool(config.POOL_OPTION)

let MySQL = {


    getCon: () => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                if (err) {
                    console.log(err)
                    return reject(err)
                }
                console.log('2');
                resolve(con)
            })
        })


    }
}


module.exports = MySQL