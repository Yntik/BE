const Refund = require('../../models/refunds');

const refund = {
    storeRefund: async ({body, paypal_id, t}) => {
        console.log('store refund');
        return await Refund.build({paypal_id: paypal_id, body: body}, {transaction: t}).save();
    }

};
module.exports = refund;