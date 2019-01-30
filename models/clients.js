const Sequelize = require('sequelize');
const db = require('../settings/sequelize');
const Op = Sequelize.Op;
const Cities = require('../models/cities')

const Clients = db.define('clients', {
    name: {
        type: Sequelize.STRING
    },

    email: {
        type: Sequelize.STRING
    },

    city_id: {
        type: Sequelize.INTEGER
    },
});

Clients.belongsTo(Cities, { foreignKey: 'city_id' })
module.exports = Clients;

