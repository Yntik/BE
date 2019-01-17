const Sequelize = require('sequelize');
const db = require('../settings/sequelize');

const Webhooks = db.define('webhooks', {
    order_id: {
        type: Sequelize.INTEGER
    },
    body: {
        type: Sequelize.JSON
    },
    state_verify: {
        type: Sequelize.INTEGER
    },
    paypal_id: {
        type: Sequelize.STRING
    }
});

module.exports = Webhooks;