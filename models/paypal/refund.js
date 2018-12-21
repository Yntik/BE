const mypool = require('../../settings/MyPool');
const mysql = require('mysql')

const refund = {


    storeRefund: async ({body, paypal_id}) => {

        const con = await mypool.getCon();
        const sql = "INSERT INTO refund (paypal_id, body) VALUES ("
            + mysql.escape(paypal_id) + ","
            + mysql.escape(JSON.stringify(body))
            + ");";
        console.log('store refund');
        console.log('sql', sql);
        const result = await con.query(sql);
        con.release();
        console.log(result);
        return result;
    }

};


module.exports = refund;