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


    createPaypal: () => {
        return mypool.getCon()
            .then(con => {

                var sql = "INSERT INTO paypal () VALUES ();";

                return new Promise((resolve, reject) => {
                    con.query(sql, (err, result) => {
                        if (err) {
                            con.rollback(function () {
                                con.release();
                                return reject(err);
                            })
                        }
                        con.release();
                        resolve(result);
                    })
                });
            });
    },

    get: ({paypal_id}) => {
        console.log('paypal get init');
        return mypool.getCon()
            .then( (con) => {
                console.log('then init in paypal get')
                var sql = 'SELECT * FROM paypal\n'
                    + "WHERE id = " + mysql.escape(Number(paypal_id));

                console.log(sql);
                console.log('paypal_id', paypal_id);
                return new Promise((resolve, reject) => {
                    con.query(sql, function (err, result) {
                        con.release();
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    })
                });
            });
    },

    refund: ({paypal_info}) => {
        return new Promise((resolve, reject) => {
            console.log('refund init');
            const  data = {
                amount: {
                    total: JSON.parse(paypal_info[0].webhook).resource.amount.total,
                    currency: JSON.parse(paypal_info[0].webhook).resource.amount.currency
                }
            }
            console.log('data',data);
            paypal_service.sale.refund(String(paypal_info[0].paypal_id), data, (err, refund) => {
                if (err) {
                    console.log('refund error', err);
                    reject(err)
                    return
                }
                console.log(refund);
                resolve({body: refund, id: JSON.parse(paypal_info[0].webhook).resource.custom});
            })
        })

    }

};


module.exports = createPaypal;