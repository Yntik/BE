const mysql = require('mysql');
const mypool = require('../../settings/MyPool');
const OrderModel = require('../orders');
const paypal_service = require('paypal-rest-sdk');
const webhookIds = require('../../settings/paypal');
const productModel = require('../product');


paypal_service.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Adr6A_xRMrDnvbJ9Bvu20s0uDNODmFFj_LKtuP4ar343E7buS6u4aLQzxvZbFJTdlKRHIXkKnA2qJvkW',
    'client_secret': 'EOZ1Giqc4-erp98mo6vLDYq-YomzEUtItxO69UH4sVfPdbAbW-k2O8guk0TC2rGyVjdFOpIzpXAhGY86'
});

const paypal = {


    stateChange: ({body}) => {
        let order;
        let price;
        console.log(typeof body);
        return new Promise((resolve, reject) => {
            console.log('check comp');
            if (body.resource.state !== 'completed') {// completed
                reject();
            }
            console.log('check comp++');
            resolve();
        })
            .then(() => {
                console.log('get order');

                return OrderModel.get(Number(body.resource.custom))
            })
            .then(result => {
                order = result;
                console.log('get price');
                return productModel.get(order[0].idproduct)
            })
            .then(result => {
                price = result;
                console.log(price,'===', body.resource.amount.total )
                if (Number(price.price) !== Number(body.resource.amount.total)){

                    return Promise.reject(new Error('Validation error'));

                }
                console.log('get con');
                return mypool.getCon()
            })
            .then(con => {
                console.log('made query', order[0].idpaypal);
                var sql = 'UPDATE paypal SET state_payment = ?, paypal_id = ?, webhook = ? WHERE id = ?'
                return new Promise((resolve, reject) => {
                    con.query(sql, [
                        1,
                        body.resource.id,
                        JSON.stringify(body),
                        order[0].idpaypal
                    ], function (err, result) {
                        if (err) {
                            console.log('err', err);
                            return reject(err);
                        }
                        con.release();
                        console.log('paypal result', result);
                        resolve({result: result, order: order});
                    })
                });
            });
    },

    verify: ({req, webhookId}) => {
        return new Promise((resolve, reject) => {
            console.log('request++++')
            paypal_service.notification.webhookEvent.verify(req.headers, req.body, webhookId, (error, response) => {
                if (error) {
                    console.log(error);
                    reject (error);
                } else {
                    console.log(response);

                    // Verification status must be SUCCESS
                    if (response.verification_status === "SUCCESS") {
                        console.log("It was a success.");
                        resolve();
                    } else {
                        console.log("It was a failed verification");
                        reject("It was a failed verification");
                    }

                }
            })
        })


    }
};


module.exports = paypal;