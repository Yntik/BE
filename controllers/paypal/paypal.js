const OrderModel = require('../../models/orders');
const paypal_service = require('paypal-rest-sdk');
const productModel = require('../../models/product');
const config = require('../../settings/paypal');
const Paypal = require('../../models/paypal');

paypal_service.configure(config.paypal_config);

const paypal = {


    stateChange: async ({body}) => {
        let order;
        let price;
        console.log(typeof body);
        console.log('check comp');
        if (body.resource.state !== 'completed') {// completed
            throw new Error('not completed');
        }
        console.log('check comp++');
        console.log('get order');
        order = await OrderModel.get(Number(body.resource.custom));
        console.log('get price');
        price = await productModel.get(order[0].idproduct);
        console.log(price, '===', body.resource.amount.total);
        if (Number(price.price) !== Number(body.resource.amount.total)) {
            throw new Error('Validation error');
        }
        console.log('made query', order[0].idpaypal);
        let result = await Paypal.update({
            state_payment: 1,
            paypal_id: body.resource.id,
            webhook: JSON.stringify(body),
            where: {id: order[0].idpaypal}
        });
        console.log('paypal result', result);
        return resolve({result: result, order: order});

    },

    verify: ({req, webhookId}) => {
        return new Promise((resolve, reject) => {
            console.log('request++++');
            paypal_service.notification.webhookEvent.verify(req.headers, req.body, webhookId, (error, response) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log(response);

                    // Verification status must be SUCCESS
                    if (response.verification_status === "SUCCESS") {
                        console.log("It was a success.");
                        resolve(1);
                    } else {
                        console.log("It was a failed verification");
                        resolve(0);
                    }

                }
            })
        })


    }
};


module.exports = paypal;