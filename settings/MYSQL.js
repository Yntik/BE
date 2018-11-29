var mysql = require('mysql');
var config = require('./MYSQL_OPTION');

var pool = mysql.createPool(config.POOL_OPTION);

function MySQL() {

    this.getCon = function (next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            next(connection);
        })
    }

    /*
    this.create = function() {
        console.log('create init')
        con = mysql.createConnection(config.MYSQL_OPTION);
    }

    this.getConnection = function () {
        console.log(con);
        con.connect((this.create),(err) => {
            if(err) {
                this.create();
                return con ;
            }
            return con ;
        });
    }
    */
}


module.exports = MySQL;