const Sequelize = require('sequelize');
const db = require('../settings/sequelize');


const Paypal = db.define('paypal', {
	state_payment: {
		type: Sequelize.INTEGER
	},
	paypal_id: {
		type: Sequelize.STRING,
		defaultValue: true
	},
	webhook: {
		type: Sequelize.JSON,
		defaultValue: true
	}
});
module.exports = Paypal;


