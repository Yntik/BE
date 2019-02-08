const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style


const test = require('./init_test');

const masters = require('../controllers/masters');
const cities = require('../controllers/cities');
const products = require('../controllers/products');
const orders = require('../controllers/orders');

const citiesModel = require('../models/cities');
const mastersModel = require('../models/masters');
const clientsModel = require('../models/clients');
const ordersModel = require('../models/orders');
const paypalModel = require('../models/paypal');
const productModel = require('../models/product');


describe('OrdersController', async () => {
    before('Remove all constraint', async () => {
        await test.removeConstraint();
        await test.destroy();
    });
    after('Add all constraint', async () => {
        await test.addConstraint()
    });
    describe('Get order function', async () => {
        beforeEach(async () => {
            try {
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

            } catch (e) {
                console.log(e);
            }
        });
        it('should show order', async () => {
            try {
                const result = await orders.get();
                let size = 1;// check order up
                let datetime = "2019-02-17T23:00:00.000Z";
                let start = new Date(datetime);
                let end = new Date(datetime);
                end.setHours(end.getHours() + Number(size));
                await result[0].dataValues.id.should.be.eql(1);
                await result[0].dataValues.client_id.should.be.eql(1);
                await result[0].dataValues.price.should.be.eql('10');
                await result[0].dataValues.product_id.should.be.eql(1);
                await result[0].dataValues.city_id.should.be.eql(1);
                await result[0].dataValues.master_id.should.be.eql(1);
                await result[0].dataValues.paypal_id.should.be.eql(1);
                await result[0].dataValues.start.should.be.eql(start);
                await result[0].dataValues.end.should.be.eql(end);

            } catch (e) {
                console.log(e);
            }

        });
    });
    describe('Create order function', async () => {
        beforeEach(async () => {
            try {
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

            } catch (e) {
                console.log(e);
            }
        });
        it('should create order', async () => {
            try {
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
                const result = await orders.create({body: {...order}});
                let size = 1;// check order up
                let datetime = "2019-02-17T23:00:00.000Z";
                let start = new Date(datetime);
                let end = new Date(datetime);
                end.setHours(end.getHours() + Number(size));
                await result.dataValues.id.should.be.eql(1);
                await result.dataValues.client_id.should.be.eql(1);
                await result.dataValues.price.should.be.eql('10');
                await result.dataValues.product_id.should.be.eql(1);
                await result.dataValues.city_id.should.be.eql(1);
                await result.dataValues.master_id.should.be.eql(1);
                await result.dataValues.paypal_id.should.be.eql(1);
                await result.dataValues.start.should.be.eql(start);
                await result.dataValues.end.should.be.eql(end);

            } catch (e) {
                console.log(e);
            }

        });
    });
    describe('Edit order function', async () => {
        beforeEach(async () => {
            try {
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
                await masters.create({
                    body:
                        {
                            name: 'Леха',
                            surname: 'Бобровик',
                            rating: 5,
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

            } catch (e) {
                console.log(e);
            }
        });
        it('should show order', async () => {
            try {
                const result = await orders.edit({
                    body: {
                        id: 1,
                        client: "Серега",
                        idclient: 1,
                        email: 'adrew@trata.com',
                        city: 1,
                        idproduct: 1,
                        idmaster: 2,
                        price: '20',
                        datetime: '2019-02-17T23:00:00.000Z',
                        size: 1
                    }
                });
                await result.should.be.a('array');
                await result.length.should.be.eql(1);
                await result[0].should.be.eql(1);

            } catch (e) {
                console.log(e);
            }

        });
    });
    describe('Remove order function', async () => {
        beforeEach(async () => {
            try {
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

            } catch (e) {
                console.log(e);
            }
        });
        it('should remove order', async () => {
            try {
                const result = await orders.deleteOrder({
                    req: {
                        query: {
                            id: 1,
                            paypal_id: 1,

                        }
                    }
                });
                await result.should.be.a('number');
                await result.should.be.eql(1);

            } catch (e) {
                console.log(e);
            }

        });
    });
});
