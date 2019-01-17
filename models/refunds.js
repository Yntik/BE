const Sequelize = require('sequelize');
const db = require('../settings/sequelize');

const Refund = db.define('refund', {
    paypal_id: {
        type: Sequelize.STRING
    },
    body: {
        type: Sequelize.JSON
    }
});

module.exports = Refund;