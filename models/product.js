const mysql = require('mysql')
const mypool = require('../settings/MyPool')

const product = {


    get: () => {
        return mypool.getCon()
            .then((con) => {
                var sql = 'SELECT * FROM product\n'
                    + "ORDER BY product.size";

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
                var sql = "INSERT INTO product (size, price) VALUES ("
                    + mysql.escape(body.size)+','+ mysql.escape(body.price) + ")";

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
                var sql = 'UPDATE product SET size = ?, price = ? WHERE id = ?';
                return new Promise((resolve, reject) => {
                    con.query(sql, [
                        Number(body.size),
                        Number(body.price),
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




module.exports = product;