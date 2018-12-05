const mysql = require('mysql');
const mypool = require('../settings/MyPool');
var nodemailer = require('nodemailer') ;



const order = {


    get: () => {
        return mypool.getCon()
            .then((con) => {
                var sql = 'SELECT orders.id, orders.idclient, orders.idmaster, orders.idcity, orders.idproduct, orders.price, orders.start, orders.end, clients.name client, clients.email, masters.name, masters.surname, product.size, citys.city\n '
                    + "FROM orders\n"
                    + "LEFT JOIN clients ON orders.idclient = clients.id\n"
                    + "LEFT JOIN masters ON orders.idmaster = masters.id\n"
                    + "LEFT JOIN product ON orders.idproduct = product.id\n"
                    + "LEFT JOIN citys ON orders.idcity = citys.id\n"
                    + "ORDER BY orders.start DESC";

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

                if (body.client.length < 3) {
                    return reject('not validation') ;

                } else if (!(body.size > 0 && body.size <= 3)) {
                    return reject('not validation') ;
                }
            })
            .then(con => {
                this.checkmaster(body)
            })
            .then(con => {
                console.log('checkmasterisfree');
                this.checkmasterisfree(body)
            })
            .then(con => {
                /* Begin transaction */
                console.log('Begin transaction ');
                con.beginTransaction(function(err) {
                   if (err) {
                       return reject(err) ;
                        }
                    this.insertclient({body: body}).then(result => {
                        this.insertorder({body: body, result: result}).then(result => {
                            con.commit(function(err) {
                                if (err) {
                                    con.rollback(function() {
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
                                resolve(result);
                            });
                        })
                    })
                })
            })

    },

    checkmaster: ({body}) => {
        console.log('checkmaster');
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

                        resolve(result);
                    })
                });
            });
    },


    checkmasterisfree: ({body}) => {
        return mypool.getCon()
            .then((con) => {
                var start = new Date(body.datetime) ;
                var end = new Date(body.datetime) ;
                end.setHours(end.getHours() + Number(body.size)) ;
                var sql = "SELECT * FROM orders\n"
                    +"WHERE idmaster = " + mysql.escape(Number(body.master.id)) + " AND (start <= "  + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" +"\n"
                    + "OR start <= "  + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end)" ;
                return new Promise((resolve, reject) => {
                    con.query(sql, function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        else if (result.length !== 0) {
                            reject('Master not found');
                            return
                        }
                        resolve(result);
                    })
                });
            });
    },


    insertclient: ({ body }) => {
        return mypool.getCon()
            .then(con => {
                var sql =  "INSERT INTO clients (name, email, idcity) VALUES (\n"
                    + mysql.escape(body.client) + ', '
                    + mysql.escape(body.email) + ', '
                    + body.city + ")\n"
                    + "ON DUPLICATE KEY UPDATE\n"
                    + "name = "+ mysql.escape(body.client) + ',\n'
                    + "idcity =" +body.city + ";\n" ;

                return new Promise((resolve, reject) => {
                    con.query(sql, (err, result) => {
                        if (err) {
                            con.rollback(function() {
                                return reject(err);
                            })}

                        resolve(result);
                    })
                });
            });
    },


    insertorder: ({ body, result }) => {
        return mypool.getCon()
            .then(con => {
                var log = result.insertId;
                var sql = "INSERT INTO orders (idclient, price, idproduct, idcity, idmaster, start, end) VALUES (\n"
                    + mysql.escape(log) + ','
                    + mysql.escape(body.price) + ','
                    + mysql.escape(Number(body.size)) + ','
                    + mysql.escape(Number(body.city)) + ','
                    + mysql.escape(Number(body.master.id)) + ','
                    + mysql.escape(start) + ','
                    + mysql.escape(end) + ");\n"

                return new Promise((resolve, reject) => {
                    con.query(sql, (err, result) => {
                        if (err) {
                            con.rollback(function() {
                            return reject(err);
                        })}

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




module.exports = order;