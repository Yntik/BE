const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style
const db = require('../settings/sequelize');

const test = require('./init_test');

const masters = require('../controllers/masters');
const cities = require('../controllers/cities');
const products = require('../controllers/products');
const orders = require('../controllers/orders');
const clients = require('../controllers/clients');

const citiesModel = require('../models/cities');
const mastersModel = require('../models/masters');
const clientsModel = require('../models/clients');
const ordersModel = require('../models/orders');
const paypalModel = require('../models/paypal');
const productModel = require('../models/product');


describe('ClientController', async () => {
    before('Remove all constraint', async () => {
        await test.removeConstraint();
        await test.destroy();
    });
    after('Add all constraint', async () => {
        await test.addConstraint()
    });
    describe('Get client function', async () => {
        beforeEach(async () => {
            await ordersModel.destroy({
                where: {},
                truncate: true,
            });
            await mastersModel.destroy({
                where: {},
                truncate: true,
            });
            await citiesModel.destroy({
                where: {},
                truncate: true,
            });
            await productModel.destroy({
                where: {},
                truncate: true,
            });
            await paypalModel.destroy({
                where: {},
                truncate: true,
            });
            await citiesModel.destroy({
                where: {},
                truncate: true,
            });
            await clientsModel.destroy({
                where: {},
                truncate: true,
            });
            await cities.create({newcity: 'Днепр'});
            await products.create({
                body: {
                    size: 1,
                    price: '10'
                }
            });
            await masters.create({
                body:
                    {
                        name: 'Гриша',
                        surname: 'Петров',
                        rating: 3,
                        city: 1
                    }
            });
            let order = {
                client: "Андрей",
                email: 'adrew@trata.com',
                city: 1,
                product: 1,
                master: {
                    id: 1,
                    name: 'Гриша',
                    surname: 'Петров',
                    rating: 3,
                    city_id: 1
                },
                datetime: '2019-02-17T23:00:00.000Z',
                size: 1
            };
            await orders.create({body: {...order}});
        });
        it('should show client', async () => {
            const result = await clients.get();
            await result[0].dataValues.id.should.be.eql(1);
            await result[0].dataValues.city_id.should.be.eql(1);
            await result[0].dataValues.name.should.be.eql('Андрей');
        });
    });
    describe('Edit client function', async () => {
        beforeEach(async () => {
            await ordersModel.destroy({
                where: {},
                truncate: true,
            });
            await mastersModel.destroy({
                where: {},
                truncate: true,
            });
            await citiesModel.destroy({
                where: {},
                truncate: true,
            });
            await productModel.destroy({
                where: {},
                truncate: true,
            });
            await paypalModel.destroy({
                where: {},
                truncate: true,
            });
            await citiesModel.destroy({
                where: {},
                truncate: true,
            });
            await clientsModel.destroy({
                where: {},
                truncate: true,
            });
            await cities.create({newcity: 'Днепр'});
            await products.create({
                body: {
                    size: 1,
                    price: '10'
                }
            });
            await masters.create({
                body:
                    {
                        name: 'Гриша',
                        surname: 'Петров',
                        rating: 3,
                        city: 1
                    }
            });
            let order = {
                client: "Андрей",
                email: 'adrew@trata.com',
                city: 1,
                product: 1,
                master: {
                    id: 1,
                    name: 'Гриша',
                    surname: 'Петров',
                    rating: 3,
                    city_id: 1
                },
                datetime: '2019-02-17T23:00:00.000Z',
                size: 1
            };
            await orders.create({body: {...order}});
        });
        it('should edit client', async () => {
            const result = await clients.edit({name: 'Богдан', email: 'newemail@gdad.com', city: 1, id: 1});
            await result.should.be.a('array');
            await result.length.should.be.eql(1);
            await result[0].should.be.eql(1);
        });
    });
    describe('Remove client function', async () => {
        beforeEach(async () => {
            await ordersModel.destroy({
                where: {},
                truncate: true,
            });
            await mastersModel.destroy({
                where: {},
                truncate: true,
            });
            await citiesModel.destroy({
                where: {},
                truncate: true,
            });
            await productModel.destroy({
                where: {},
                truncate: true,
            });
            await paypalModel.destroy({
                where: {},
                truncate: true,
            });
            await citiesModel.destroy({
                where: {},
                truncate: true,
            });
            await clientsModel.destroy({
                where: {},
                truncate: true,
            });
            await cities.create({newcity: 'Днепр'});
            await products.create({
                body: {
                    size: 1,
                    price: '10'
                }
            });
            await masters.create({
                body:
                    {
                        name: 'Гриша',
                        surname: 'Петров',
                        rating: 3,
                        city: 1
                    }
            });
            let order = {
                client: "Андрей",
                email: 'adrew@trata.com',
                city: 1,
                product: 1,
                master: {
                    id: 1,
                    name: 'Гриша',
                    surname: 'Петров',
                    rating: 3,
                    city_id: 1
                },
                datetime: '2019-02-17T23:00:00.000Z',
                size: 1
            };
            await orders.create({body: {...order}});
        });

        it('should remove client', async () => {
            await orders.deleteOrder({
                req: {
                    query: {
                        id: 1,
                        paypal_id: 1,

                    }
                }
            });
            const result = await clients.delete({
                query: {
                    id: 1,
                }
            });
            await result.should.be.a('number');
            await result.should.be.eql(1);
        });
    });
});
