const Sequelize = require('sequelize');
const db = require('../settings/sequelize');


const Products = db.define('products', {
	size: {
		type: Sequelize.INTEGER
	},
	price: {
		type: Sequelize.STRING
	}
});
module.exports = Products;

