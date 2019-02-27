const Webhooks =  require('../../models/webhooks');
const webhook = {
	get: async ({paypal_id}) => {
		// console.log('webhook select init');
		const result = await Webhooks.findAll({
			where: {paypal_id: String(paypal_id)}
		});
		// console.log(result);
		return result[0];

	},
	storeWebhook: async (body, order, state_verify, paypal_id) => {
		// console.log('store webhook');
		// console.log(order.id, JSON.stringify(body), state_verify, paypal_id);
		return await Webhooks.create({
			order_id: order.id,
			body: JSON.stringify(body),
			state_verify: state_verify,
			paypal_id: paypal_id,
		});
	}

};



module.exports = webhook;