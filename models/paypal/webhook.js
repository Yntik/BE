const mypool = require('../../settings/MyPool');
const mysql = require('mysql')

const webhook = {


    storeWebhook: async (body, order) => {
        const con = await mypool.getCon();
        const sql = "INSERT INTO webhooks (order_id, body) VALUES ("
            + mysql.escape(order.id) + ","
            + mysql.escape(JSON.stringify(body))
            + ");";
        console.log('store webhook');
        console.log('sql', sql);
        const result = await con.query(sql);
        con.release();
        console.log(result);
        return result;
    }

};


module.exports = webhook;