const Sequelize = require('sequelize');
const db = require('../settings/sequelize');

const Webhooks = db.define('refund', {
    order_id: {
        type: Sequelize.INTEGER
    },
    body: {
        type: Sequelize.JSON
    }
});

module.exports = Webhooks;