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

    idcity: {
        type: Sequelize.INTEGER
    },
});

Clients.belongsTo(Cities, { foreignKey: 'idcity' })
module.exports = Clients;

