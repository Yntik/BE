const Sequelize = require('sequelize');
const db = require('../../settings/sequelize');

const Refund = db.define('refund', {
    paypal_id: {
        type: Sequelize.STRING
    },
    body: {
        type: Sequelize.JSON
    }
});


const refund = {


    storeRefund: async ({body, paypal_id}) => {
        console.log('store refund');
        return await Refund.build({paypal_id: paypal_id, body: body}).save();
    }

};


module.exports = refund;