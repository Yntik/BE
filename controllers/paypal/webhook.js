const Webhooks =  require('../../models/webhooks');
const webhook = {
    get: async ({paypal_id}) => {
        console.log('webhook select init');
        const result = await Webhooks.findOne({
            where: {paypal_id: String(paypal_id)}
        });
        console.log(result);
        return result[0];

    },
    storeWebhook: async (body, order, state_verify, paypal_id) => {
        console.log('store webhook');
        return await Webhooks.build({
            order_id: order.id,
            body: JSON.stringify(body),
            state_verify: state_verify,
            paypal_id: paypal_id,
        });
    }

};


module.exports = webhook;