const mysql = require('mysql')
const mypool = require('../settings/MyPool')

const cities = {


    get: () => {
        return mypool.getCon()
            .then((con) => {
                var sql = 'SELECT * FROM cities';

                return new Promise((resolve, reject) => {
                    con.query(sql, function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(result);
                    })
                });
            });
    },

    create: ({ newcity }) => {
        return mypool.getCon()
            .then(con => {
                var sql = `INSERT INTO cities (city) VALUES (${mysql.escape(newcity)})`;

                return new Promise((resolve, reject) => {
                    con.query(sql, (err, result) => {
                        if (err) {
                            return reject(err);
                        }

                        resolve(result);
                    })
                });
            });
    },

    edit: ({ editcity,id }) => {
        return mypool.getCon()
            .then(con => {
                var sql = 'UPDATE cities SET city = ? WHERE id = ?'
                return new Promise((resolve, reject) => {
                    con.query(sql, [
                        editcity,
                        id
                    ], function (err, result) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(result);
                    })
                });
            });
    }

};




module.exports = cities;