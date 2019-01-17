const Sequelize = require('sequelize');
const db = require('../settings/sequelize');
const Op = Sequelize.Op;
const Cities = require('../models/cities');
const Masters = require('../models/masters');
const Products = require('../models/product');
const Clients = require('../models/clients');
const Paypal = require('../models/paypal');
const Orders = db.define('orders', {
    idclient: {
        type: Sequelize.INTEGER
    },
    price: {
        type: Sequelize.STRING
    },
    idproduct: {
        type: Sequelize.INTEGER
    },
    idcity: {
        type: Sequelize.INTEGER
    },
    idmaster: {
        type: Sequelize.INTEGER
    },
    start: {
        type: Sequelize.DATE
    },
    end: {
        type: Sequelize.DATE
    }
});
Orders.belongsTo(Cities, {foreignKey: 'idcity'});
Orders.belongsTo(Masters, {foreignKey: 'idmaster'});
Orders.belongsTo(Clients, {foreignKey: 'idclient'});
Orders.belongsTo(Products, {foreignKey: 'idproduct'});
Orders.belongsTo(Paypal, {foreignKey: 'idpaypal'});

module.exports = Orders;