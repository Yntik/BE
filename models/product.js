const mysql = require('mysql')
const mypool = require('../settings/MyPool')

const product = {


    get: async (product_id) => {
        const con = await mypool.getCon();
        var sql;
        if (product_id === undefined) {
            sql = 'SELECT * FROM product\n'
                + "ORDER BY product.size";
        }
        else {
            sql = 'SELECT * FROM product\n'
                + "WHERE id = " + mysql.escape(Number(product_id));
        }
        console.log('sql///', sql);
        const result = await con.query(sql);
        con.release();
        if (product_id === undefined) {
            return result;
        }
        else {
            console.log('resuuuulttt', result);
            return (result[0]);
        }
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