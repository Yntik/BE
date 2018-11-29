var mysql = require('mysql');
var config = require('./config');



var con;

function MySQL() {

    this.create = function() {
        con = mysql.createConnection(config.MYSQL_OPTION);
        con.connect(function (err) {
            if (err) {
                console.log({success: false, error: 1, data: 'not connected to database!'});
                return {success: false, error: 1, data: 'not connected to database!'};
            }
            return {success: true, error: false, data: 'connected to database!'};
        });
    }

    this.getConnection = function () {
        if(con.isConnected === true) return {success: true, con: con, data: 'connected to database!'};
        let result = this.create();
        if (result.success) return {success: true, con: con, data: 'connected to database!'};
        else return {success: false, data: 'not connected to database!'};
    }
}


module.exports = MySQL;