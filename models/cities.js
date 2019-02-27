const Sequelize = require('sequelize');
const db = require('../settings/sequelize');


const Cities = db.define('cities', {
	city: {
		type: Sequelize.STRING
	}
});
module.exports = Cities;


// module.exports = cities;