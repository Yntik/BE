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
        // return db.transaction(async (t) => {
        //     let options = { raw: true, transaction: t };
        //     await db.query('SET FOREIGN_KEY_CHECKS = 0', null, options);
        //
        //     await citiesModel.destroy({
        //         where: {},
        //         truncate: true,
        //         ...options
        //     });
        //     await mastersModel.destroy({
        //         where: {},
        //         truncate: true,
        //         ...options
        //     });
        //     await clientsModel.destroy({
        //         where: {},
        //         truncate: true,
        //         ...options
        //     });
        //     await ordersModel.destroy({
        //         where: {},
        //         truncate: true,
        //         ...options
        //     });
        //     await paypalModel.destroy({
        //         where: {},
        //         truncate: true,
        //         ...options
        //     });
        //     await productsModel.destroy({
        //         where: {},
        //         truncate: true,
        //         ...options
        //     });
        //     await refundsModel.destroy({
        //         where: {},
        //         truncate: true,
        //         ...options
        //     });
        //     await webhooksModel.destroy({
        //         where: {},
        //         truncate: true,
        //         ...options
        //     });
        //     await db.query('SET FOREIGN_KEY_CHECKS = 1', null, options);
        // });
        // await citiesModel.destroy({
        //     where: {},
        //     truncate: true,
        // });
        // await mastersModel.destroy({
        //     where: {},
        //     truncate: true,
        // });
        // await clientsModel.destroy({
        //     where: {},
        //     truncate: true,
        // });
        // await ordersModel.destroy({
        //     where: {},
        //     truncate: true,
        // });
        // await paypalModel.destroy({
        //     where: {},
        //     truncate: true,
        // });
        // await productsModel.destroy({
        //     where: {},
        //     truncate: true,
        // });
        // await refundsModel.destroy({
        //     where: {},
        //     truncate: true,
        // });
        // await webhooksModel.destroy({
        //     where: {},
        //     truncate: true,
        // });
        return db.transaction(async (t) => {
            let options = { raw: true, transaction: t };
            await db.query('SET FOREIGN_KEY_CHECKS = 0', options);

            await db.query('DELETE FROM cities;', options);
            await db.query('ALTER TABLE cities AUTO_INCREMENT = 1;', options);

            await db.query('DELETE FROM masters;', options);
            await db.query('ALTER TABLE masters AUTO_INCREMENT = 1;', options);

            await db.query('DELETE FROM clients;', options);
            await db.query('ALTER TABLE clients AUTO_INCREMENT = 1;', options);

            await db.query('DELETE FROM orders;', options);
            await db.query('ALTER TABLE orders AUTO_INCREMENT = 1;', options);

            await db.query('DELETE FROM paypal;', options);
            await db.query('ALTER TABLE paypal AUTO_INCREMENT = 1;', options);

            await db.query('DELETE FROM products;', options);
            await db.query('ALTER TABLE products AUTO_INCREMENT = 1;', options);

            await db.query('DELETE FROM refund;', options);
            await db.query('ALTER TABLE refund AUTO_INCREMENT = 1;', options);

            await db.query('DELETE FROM webhooks;', options);
            await db.query('ALTER TABLE webhooks AUTO_INCREMENT = 1;', options);

            await db.query('SET FOREIGN_KEY_CHECKS = 1', options);
        })
    },

    removeConstraint: async () => {
        await db.getQueryInterface().removeConstraint('orders', 'master_id');
        await db.getQueryInterface().removeConstraint('orders', 'order_city');
        await db.getQueryInterface().removeConstraint('orders', 'client_id');
        await db.getQueryInterface().removeConstraint('orders', 'paypal_id');
        await db.getQueryInterface().removeConstraint('orders', 'product_id');
        await db.getQueryInterface().removeConstraint('clients', 'client_city');
        await db.getQueryInterface().removeConstraint('masters', 'master_city');
    },

    addConstraint: async () => {
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