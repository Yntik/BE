const mypool = require('../../settings/MyPool');
const mysql = require('mysql');
const paypal_service = require('paypal-rest-sdk');
const config = require('../../settings/paypal');
const Paypal = require('../../models/paypal');

paypal_service.configure(config.paypal_config);


const createPaypal = {


    createPaypal: async ({t}) => {
        return await Paypal.create({transaction: t});
    },

    get: async ({paypal_id}) => {
        console.log('paypal get init');
        let result = await Paypal.findOne({
            where: {id: Number(paypal_id)}
        });
        return result[0]
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


    },

    delete: async ({query, t}) => {
        console.log('delete init');
        return await Paypal.destroy({where: {id: Number(query.id)}, transaction: t})
    }

};


module.exports = createPaypal;