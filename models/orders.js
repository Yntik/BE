const Sequelize = require('sequelize');
const db = require('../settings/sequelize');
const Op = Sequelize.Op;
const Cities = require('../models/cities');
const Masters = require('../models/masters');
const Products = require('../models/product');
const Clients = require('../models/clients');
const Paypal = require('../models/paypal');
const Orders = db.define('orders', {
    client_id: {
        type: Sequelize.INTEGER
    },
    price: {
        type: Sequelize.STRING
    },
    product_id: {
        type: Sequelize.INTEGER
    },
    city_id: {
        type: Sequelize.INTEGER
    },
    master_id: {
        type: Sequelize.INTEGER
    },
    start: {
        type: Sequelize.DATE
    },
    end: {
        type: Sequelize.DATE
    },
    paypal_id: {
        type: Sequelize.INTEGER
    }
});
Orders.belongsTo(Cities, {foreignKey: 'city_id'});
Orders.belongsTo(Masters, {foreignKey: 'master_id'});
Orders.belongsTo(Clients, {foreignKey: 'client_id'});
Orders.belongsTo(Products, {foreignKey: 'product_id'});
Orders.belongsTo(Paypal, {foreignKey: 'paypal_id'});

module.exports = Orders;