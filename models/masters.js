const Sequelize = require('sequelize');
const db = require('../settings/sequelize');
const Op = Sequelize.Op;
const Cities = require('../models/cities');
const Masters = db.define('masters', {
    name: {
        type: Sequelize.STRING
    },
    surname: {
        type: Sequelize.STRING
    },
    rating: {
        type: Sequelize.INTEGER
    },

    city_id: {
        type: Sequelize.INTEGER
    },
});

Masters.belongsTo(Cities, { foreignKey: 'city_id' });

module.exports = Masters;