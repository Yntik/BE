const mysql = require('mysql');
const mypool = require('../../settings/MyPool');






const webhook = {

    create: ({body}) => {
        return mypool.getCon()
            .then(con => {
                var sql = `INSERT INTO webhooks (order_id, webhook) VALUES (${mysql.escape(body.resource.id)}, ${body})`;

                return new Promise((resolve, reject) => {
                    con.query(sql, (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        con.release();
                        resolve(result);
                    })
                });
            });
    },



};


module.exports = webhook;