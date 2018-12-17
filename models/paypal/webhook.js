const mypool = require('../../settings/MyPool');
const mysql = require('mysql')

const webhook = {


    storeWebhook: (body, order) => {
        return mypool.getCon()
            .then(con => {

                var sql;
                sql = "INSERT INTO webhooks (order_id, body) VALUES ("
                    + mysql.escape(order.id) + ","
                    + mysql.escape(JSON.stringify(body))
                    + ");";
                console.log('store webhook');
                console.log('sql', sql);
                return new Promise((resolve, reject) => {
                    con.query(sql, (err, result) => {
                        if (err) {
                            con.rollback(function () {
                                con.release();
                                return reject(err);
                            })
                        }
                        con.release();
                        console.log(result);
                        resolve(result);
                    })
                });
            });
    }

};


module.exports = webhook;