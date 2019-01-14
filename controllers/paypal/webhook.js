const mypool = require('../../settings/MyPool');
const mysql = require('mysql')

const webhook = {

    get: async ({paypal_id}) => {
        console.log('webhook select init');
        const con = await mypool.getCon();
        const sql = 'SELECT * FROM webhooks\n'
            + "WHERE paypal_id = " + mysql.escape(String(paypal_id));
        console.log(sql);
        console.log('paypal_id', paypal_id);
        const result = await con.query(sql);
        con.release();
        console.log(result);
        return result[0];

    },

    storeWebhook: async (body, order, state_verify, paypal_id) => {
        const con = await mypool.getCon();
        const sql = "INSERT INTO webhooks (order_id, body, state_verify, paypal_id) VALUES ("
            + mysql.escape(order.id) + ","
            + mysql.escape(JSON.stringify(body)) + ","
            + mysql.escape(state_verify) + ","
            + mysql.escape(paypal_id)
            + ");";
        console.log('store webhook');
        console.log('sql', sql);
        const result = await con.query(sql);
        con.release();
        console.log(result);
        console.log("success");
        return result;
    }

};


module.exports = webhook;