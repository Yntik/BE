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

    idcity: {
        type: Sequelize.INTEGER
    },
});

Masters.belongsTo(Cities, { foreignKey: 'idcity' });

module.exports = Masters;