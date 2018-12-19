const mypool = require('../../settings/MyPool');
const mysql = require('mysql');
const paypal_service = require('paypal-rest-sdk');
const webhookModel = require('./webhook');

paypal_service.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Adr6A_xRMrDnvbJ9Bvu20s0uDNODmFFj_LKtuP4ar343E7buS6u4aLQzxvZbFJTdlKRHIXkKnA2qJvkW',
    'client_secret': 'EOZ1Giqc4-erp98mo6vLDYq-YomzEUtItxO69UH4sVfPdbAbW-k2O8guk0TC2rGyVjdFOpIzpXAhGY86'
});


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