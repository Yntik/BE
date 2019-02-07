const db = require('../settings/sequelize');

const citiesModel = require('../models/cities');
const mastersModel = require('../models/masters');
const clientsModel = require('../models/clients');
const ordersModel = require('../models/orders');
const paypalModel = require('../models/paypal');
const productsModel = require('../models/product');
const refundsModel = require('../models/refunds');
const webhooksModel = require('../models/webhooks');

const test = {
    destroy: async () => {
        await citiesModel.destroy({
            where: {},
            truncate: true,
        });
        await mastersModel.destroy({
            where: {},
            truncate: true,
        });
        await clientsModel.destroy({
            where: {},
            truncate: true,
        });
        await ordersModel.destroy({
            where: {},
            truncate: true,
        });
        await paypalModel.destroy({
            where: {},
            truncate: true,
        });
        await productsModel.destroy({
            where: {},
            truncate: true,
        });
        await refundsModel.destroy({
            where: {},
            truncate: true,
        });
        await webhooksModel.destroy({
            where: {},
            truncate: true,
        });
    },

    removeConstraint: async () => {
        console.log('Remove Constraint');
        console.log('1');
        await db.getQueryInterface().removeConstraint('orders', 'master_id');
        console.log('2');
        await db.getQueryInterface().removeConstraint('orders', 'order_city');
        console.log('3');
        await db.getQueryInterface().removeConstraint('orders', 'client_id');
        console.log('4');
        await db.getQueryInterface().removeConstraint('orders', 'paypal_id');
        console.log('5');
        await db.getQueryInterface().removeConstraint('orders', 'product_id');
        console.log('6');
        await db.getQueryInterface().removeConstraint('clients', 'client_city');
        console.log('7');
        await db.getQueryInterface().removeConstraint('masters', 'master_city');
    },

    addConstraint: async () => {
        console.log('Add Constraint');
        console.log('1');
        await db.getQueryInterface().addConstraint('orders', ['master_id'], {
            type: 'foreign key',
            name: 'master_id',
            references: { //Required field
                table: 'masters',
                field: 'id'
            },
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        });
        console.log('2');
        await db.getQueryInterface().addConstraint('orders', ['city_id'], {
            type: 'foreign key',
            name: 'order_city',
            references: { //Required field
                table: 'cities',
                field: 'id'
            },
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        });
        console.log('3');
        await db.getQueryInterface().addConstraint('orders', ['client_id'], {
            type: 'foreign key',
            name: 'client_id',
            references: { //Required field
                table: 'clients',
                field: 'id'
            },
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        });
        console.log('4');
        await db.getQueryInterface().addConstraint('orders', ['paypal_id'], {
            type: 'foreign key',
            name: 'paypal_id',
            references: { //Required field
                table: 'paypal',
                field: 'id'
            },
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        });
        console.log('5');
        await db.getQueryInterface().addConstraint('orders', ['product_id'], {
            type: 'foreign key',
            name: 'product_id',
            references: { //Required field
                table: 'products',
                field: 'id'
            },
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        });
        console.log('6');
        await db.getQueryInterface().addConstraint('clients', ['city_id'], {
            type: 'foreign key',
            name: 'client_city',
            references: { //Required field
                table: 'cities',
                field: 'id'
            },
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        });
        console.log('7');
        await db.getQueryInterface().addConstraint('masters', ['city_id'], {
            type: 'foreign key',
            name: 'master_city',
            references: { //Required field
                table: 'cities',
                field: 'id'
            },
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        });
    }
};

module.exports = test;