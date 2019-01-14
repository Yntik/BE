const Sequelize = require('sequelize');
const db = require('../settings/sequelize');
const Op = Sequelize.Op;

const Paypal = db.define('paypal', {
    state_payment: {
        type: Sequelize.INTEGER
    },
    paypal_id: {
        type: Sequelize.STRING,
        defaultValue: true
    }
});
module.exports = Paypal;


