const mysql = require('mysql')
const mypool = require('../settings/MyPool')

const product = {


    get: (product_id) => {
        return mypool.getCon()
            .then((con) => {
                var sql ;
                if (product_id === undefined) {
                    sql = 'SELECT * FROM product\n'
                        + "ORDER BY product.size";
                }
                else {
                    sql = 'SELECT * FROM product\n'
                        + "WHERE id = " + mysql.escape(Number(product_id));
                }
                console.log('sql///', sql);
                return new Promise((resolve, reject) => {
                    con.query(sql, function (err, result) {
                        con.release();
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (product_id === undefined) {
                            resolve(result);
                        }
                        else {
                            console.log('resuuuulttt', result);
                            resolve({price: result[0].price});
                        }

                    })
                });
            });
    },

    create: ({body}) => {
        return mypool.getCon()
            .then(con => {
                var sql = "INSERT INTO product (size, price) VALUES ("
                    + mysql.escape(body.size) + ',' + mysql.escape(body.price) + ")";

                return new Promise((resolve, reject) => {
                    con.query(sql, (err, result) => {
                        con.release();
                        if (err) {
                            return reject(err);
                        }

                        resolve(result);
                    })
                });
            });
    },

    edit: ({body}) => {
        return mypool.getCon()
            .then(con => {
                var sql = 'UPDATE product SET size = ?, price = ? WHERE id = ?';
                return new Promise((resolve, reject) => {
                    con.query(sql, [
                        Number(body.size),
                        Number(body.price),
                        body.id
                    ], function (err, result) {
                        con.release();
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