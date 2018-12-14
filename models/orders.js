const mysql = require('mysql');
const mypool = require('../settings/MyPool');
const nodemailer = require('nodemailer');
const createPaypal = require('./paypal/createPaypal');

const order = {


    get: (order_id) => {
        console.log('get orders init');
        return mypool.getCon()
            .then((con) => {
                var sql;
                if (order_id === undefined) {
                    console.log('order id === undefined');
                    sql = 'SELECT orders.id, orders.idclient, orders.idmaster, orders.idcity, orders.idproduct, orders.price, orders.start, orders.end, clients.name client, clients.email, masters.name, masters.surname, product.size, cities.city\n '
                        + "FROM orders\n"
                        + "LEFT JOIN clients ON orders.idclient = clients.id\n"
                        + "LEFT JOIN masters ON orders.idmaster = masters.id\n"
                        + "LEFT JOIN product ON orders.idproduct = product.id\n"
                        + "LEFT JOIN cities ON orders.idcity = cities.id\n"
                        + "ORDER BY orders.start DESC";
                }
                else {
                    console.log('made query order');
                    sql = 'SELECT * FROM orders\n'
                        + 'WHERE id = ' + mysql.escape(order_id);
                }

                    return new Promise((resolve, reject) => {
                        console.log('select order');
                        con.query(sql, function (err, result) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            con.release();
                            resolve(result);
                        })
                    });
            });
    },

    create: ({body}) => {
        return new Promise((resolve, reject) => {
            if (body.client.length < 3) {
                return reject('not validation');
            } else if (!(body.size > 0 && body.size <= 3)) {
                return reject('not validation');
            }

            resolve();
        })
            .then(() => {
                console.log('checkmaster');
                return checkmaster({body: body})
            })
            .then(() => {
                console.log('checkmasterisfree');
                return checkmasterisfree({body: body})
            })
            .then((con) => {
                /* Begin transaction */
                console.log('Begin transaction ');

                return new Promise((resolve, reject) => {
                    let client_id;
                    let paypal_id;
                    let price;

                    con.beginTransaction(function (err) {
                        if (err) {
                            return reject(err)
                        }
                        console.log('insertclient');
                        return insertclient({body: body})
                            .then(result => {
                                client_id = result.insertId;
                                console.log('checkproduct');
                                return checkproduct({body: body})
                            })
                            .then(result => {
                                price = result.price;
                                console.log('createPaypal');
                                return createPaypal.createPaypal();
                            })
                            .then(result => {
                                paypal_id = result.insertId;
                                console.log('insertorder', result);
                                return insertorder({
                                    body: body,
                                    price: price,
                                    client_id: client_id,
                                    paypal_id: paypal_id
                                })
                            })
                            .then(result => {
                                con.commit(function (err) {
                                    if (err) {
                                        con.rollback(function () {
                                            return reject(err);
                                        });
                                    }
                                    console.log('Transaction Complete.');

                                    /* End transaction */
                                    var transporter = nodemailer.createTransport({
                                        service: 'Gmail',
                                        auth: {
                                            user: 'clockwiseclockware@gmail.com',
                                            pass: 'passwordsecret'
                                        }
                                    });
                                    console.log('created');
                                    transporter.sendMail({
                                        from: 'clockwiseclockware@gmail.com',
                                        to: body.email,
                                        subject: 'Заказ принят!',
                                        text: 'Ваш заказ поступил в обработку!'
                                    });
                                });

                                resolve(result);
                            })
                    });
                })
            })
    },

    edit: ({body}) => {
        return mypool.getCon()
            .then(con => {
                return new Promise((resolve, reject) => {
                    con.beginTransaction(function (err) {
                        if (err) {
                            return reject('trouble of database(1)');
                        }
                        return updateclient({body: body})
                            .then(() => {
                                return updateorder({body: body});
                            })
                            .then(result => {
                                con.commit(function (err) {
                                    if (err) {
                                        con.rollback(function () {
                                            return reject(err);
                                        });
                                    }
                                    console.log('Transaction Complete.');
                                    con.release();
                                    resolve(result);
                                    /* End transaction */
                                });
                            })
                    });
                });
            })
    },
};


function checkproduct({body, result_client}) {
    return mypool.getCon()
        .then((con) => {
            var sql = 'SELECT * FROM product\n'
                + 'WHERE product.id = ' + mysql.escape(body.size);
            return new Promise((resolve, reject) => {
                con.query(sql, function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    con.release();
                    console.log('in product', result[0].price);
                    resolve({price: result[0].price});
                })
            });
        });
}


function updateclient({body}) {
    return mypool.getCon()
        .then((con) => {
            var sql = 'UPDATE clients SET name = ?, email = ?, idcity = ? WHERE id  = ?';
            return new Promise((resolve, reject) => {
                con.query(sql, [
                    body.client,
                    body.email,
                    Number(body.city),
                    Number(body.idclient)
                ], function (err, result) {
                    if (err) {
                        con.rollback(function () {
                            return reject('trouble of database(2)');
                        });
                    }
                    con.release();
                    resolve();
                })
            })
        })
};


function updateorder({body}) {
    return mypool.getCon()
        .then((con) => {
            var start = new Date(body.datetime);
            var end = new Date(body.datetime);
            end.setHours(end.getHours() + Number(body.size))
            sql = 'UPDATE orders SET idclient = ?, idcity = ?, idmaster = ?, price = ?, start = ?, end = ?  WHERE id  = ?';
            return new Promise((resolve, reject) => {
                con.query(sql, [
                    Number(body.idclient),
                    Number(body.city),
                    Number(body.idmaster),
                    Number(body.price),
                    start,
                    end,
                    Number(body.id)
                ], function (err, result) {
                    if (err) {
                        con.rollback(function () {
                            return reject('trouble of database(3)');
                        });
                    }
                    con.release();
                    resolve(result);
                })
            })
        })
};


function checkmaster({body}) {
    return mypool.getCon()
        .then((con) => {
            var sql = "SELECT * FROM masters\n"
                + "WHERE masters.name = "
                + mysql.escape(body.master.name) + " AND "
                + "masters.surname = "
                + mysql.escape(body.master.surname) + ' AND '
                + "masters.rating = "
                + mysql.escape(body.master.rating) + ' AND '
                + "masters.idcity = "
                + mysql.escape(body.master.idcity) + " ;";
            return new Promise((resolve, reject) => {
                con.query(sql, function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    else if (result.length === 0) {
                        reject('Master not found');
                        return
                    }
                    con.release();
                    resolve(result);
                })
            });
        });
};


function checkmasterisfree({body}) {
    return mypool.getCon()
        .then((con) => {
            var start = new Date(body.datetime);
            var end = new Date(body.datetime);
            end.setHours(end.getHours() + Number(body.size));
            var sql = "SELECT * FROM orders\n"
                + "WHERE idmaster = " + mysql.escape(Number(body.master.id)) + " AND (start <= " + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" + "\n"
                + "OR start <= " + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end)";

            return new Promise((resolve, reject) => {
                con.query(sql, function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    } else if (result.length !== 0) {
                        reject('Master not found');
                        return
                    }
                    con.release();
                    resolve(con);
                })
            });
        });
};


function insertorder({body, price, client_id, paypal_id}) {
    console.log(typeof price, " priseee ", price);
    return mypool.getCon()
        .then(con => {
            var start = new Date(body.datetime);
            var end = new Date(body.datetime);
            var sql = "INSERT INTO orders (idclient, price, idproduct, idcity, idmaster, start, end, idpaypal) VALUES (\n"
                + mysql.escape(client_id) + ','
                + mysql.escape(String(price)) + ','
                + mysql.escape(Number(body.size)) + ','
                + mysql.escape(Number(body.city)) + ','
                + mysql.escape(Number(body.master.id)) + ','
                + mysql.escape(start) + ','
                + mysql.escape(end) + ','
                + mysql.escape(paypal_id) + ");\n";
            return new Promise((resolve, reject) => {
                con.query(sql, (err, result) => {
                    if (err) {
                        con.rollback(function () {
                            return reject(err);
                        })
                    }
                    console.log(result);
                    con.release();
                    resolve(result);
                })
            });
        });
}


function insertclient({body}) {
    return mypool.getCon()
        .then(con => {
            var sql = "INSERT INTO clients (name, email, idcity) VALUES (\n"
                + mysql.escape(body.client) + ', '
                + mysql.escape(body.email) + ', '
                + body.city + ")\n"
                + "ON DUPLICATE KEY UPDATE\n"
                + "name = " + mysql.escape(body.client) + ',\n'
                + "idcity =" + body.city + ";\n";

            return new Promise((resolve, reject) => {
                con.query(sql, (err, result) => {
                    if (err) {
                        con.rollback(function () {
                            return reject(err);
                        })
                    }
                    con.release();
                    resolve(result);
                })
            });
        });
};


module.exports = order;