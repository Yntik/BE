const mypool = require('../../settings/MyPool');
const mysql = require('mysql');
const paypal_service = require('paypal-rest-sdk');
const config = require('../../settings/paypal');


paypal_service.configure(config.paypal_config);


const createPaypal = {


    createPaypal: async ({con}) => {
        const sql = "INSERT INTO paypal () VALUES ();";
        const result = await con.query(sql);
        return result;

    },

    get: async ({paypal_id}) => {
        console.log('paypal get init');
        const con = await mypool.getCon();
        console.log('then init in paypal get');
        const sql = 'SELECT * FROM paypal\n'
            + "WHERE id = " + mysql.escape(Number(paypal_id));
        console.log(sql);
        console.log('paypal_id', paypal_id);
        const result = await con.query(sql);
        con.release();
        return result[0];

    },

    refund: async ({paypal_info}) => {
        console.log('refund init');
        const data = {
            amount: {
                total: JSON.parse(paypal_info.webhook).resource.amount.total,
                currency: JSON.parse(paypal_info.webhook).resource.amount.currency
            }
        };
        console.log('data', data);
        return new Promise((resolve, reject) => {
            paypal_service.sale.refund(String(paypal_info.paypal_id), data, (err, refund) => {
                if (err) {
                    console.log('refund error', err);
                    reject(err);
                    return;
                }
                console.log(refund);
                resolve({body: refund, id: JSON.parse(paypal_info.webhook).resource.custom})
            })
        })


    }

};


module.exports = createPaypal;