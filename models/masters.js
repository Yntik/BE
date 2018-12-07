const mysql = require('mysql')
const mypool = require('../settings/MyPool')

const master = {


    getFreeMaster: ({ query }) => {
        return mypool.getCon()
            .then((con) => {
                var start = new Date(String(query.datetime)) ;
                var end = new Date(String(query.datetime)) ;
                end.setHours(end.getHours() + Number(query.size))

                var sql = '';
                if (query.option === 'new') {
                    console.log('free master for new order');
                    sql = 'SELECT masters.id, masters.name, masters.surname, masters.idcity, masters.rating, cities.city\n'
                        + "FROM masters\n"
                        + "LEFT JOIN cities ON masters.idcity = cities.id\n"
                        + "WHERE cities.id = " + mysql.escape(decodeURI(query.city)) + "\n"
                        + "AND masters.id NOT IN (" +"\n"
                        + "SELECT idmaster FROM orders WHERE start <= "  + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" +"\n"
                        + "OR start <= "  + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end )" ;
                }
                else {
                    sql = 'SELECT masters.id, masters.name, masters.surname, masters.idcity, masters.rating, cities.city\n '
                        + "FROM masters\n"
                        + "LEFT JOIN cities ON masters.idcity = cities.id\n"
                        + "WHERE cities.id = " + mysql.escape(decodeURI(query.city)) + "\n"
                        + "AND masters.id NOT IN (" +"\n"
                        + "SELECT idmaster FROM orders WHERE (start <= "  + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" +"\n"
                        + "OR start <= "  + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end) AND NOT orders.id = " + mysql.escape(Number(query.option)) + ")" ;
                }

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

    get: () => {
        return mypool.getCon()
            .then((con) => {
                var sql = 'SELECT masters.id, masters.name, masters.surname, masters.rating, masters.idcity, cities.city\n '
                    + "FROM masters\n"
                    + "LEFT JOIN cities ON masters.idcity = cities.id\n"
                    + "ORDER BY masters.rating DESC" ;

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

    create: ({ body }) => {
        return mypool.getCon()
            .then(con => {
                var sql = "INSERT INTO masters (name, surname, rating, idcity) VALUES ("
                    + mysql.escape(body.name) + ','
                    + mysql.escape(body.surname) + ','
                    + mysql.escape(body.rating) + ','
                    + mysql.escape(body.city) + ")";

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

    edit: ({ body }) => {
        return mypool.getCon()
            .then(con => {
                var sql = 'UPDATE masters SET name = ?, surname = ?, rating = ?, idcity = ? WHERE id = ?';
                return new Promise((resolve, reject) => {
                    con.query(sql, [
                        body.name,
                        body.surname,
                        body.rating,
                        body.city,
                        body.id
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




module.exports = master;