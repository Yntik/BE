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

const mastersModel = require('../models/masters');
const citiesModel = require('../models/cities');
const ordersModel = require('../models/orders');
const productModel = require('../models/product');
const paypalModel = require('../models/paypal');

describe('MastersController', async () => {
    before('Remove all constraint and clear all DB', async () => {
        await test.removeConstraint();
        await test.destroy();
    });
    after('Add all constraint', async () => {
        await test.addConstraint()
    });
    describe('Get masters function', async () => {
        beforeEach(async () => {
            try {
                await mastersModel.destroy({
                    where: {},
                    truncate: true,
                });
                await citiesModel.destroy({
                    where: {},
                    truncate: true,
                });
                await cities.create({newcity: 'Львов'});
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
        it('should show city name\'s Львов', async () => {
            try {
                const result = await masters.get();
                await result[0].dataValues.should.be.a('object');
                await result[0].dataValues.id.should.be.eql(1);
                await result[0].dataValues.name.should.be.eql('Гриша');
                await result[0].dataValues.surname.should.be.eql('Петров');
                await result[0].dataValues.rating.should.be.eql(3);
                await result[0].dataValues.city_id.should.be.eql(1);
            } catch (e) {
                console.log(e);
            }

        });
    });
    describe('Create master function', async () => {
        beforeEach(async () => {
            try {
                await mastersModel.destroy({
                    where: {},
                    truncate: true,
                });
                await citiesModel.destroy({
                    where: {},
                    truncate: true,
                });
                await cities.create({newcity: 'Львов'});
            } catch (e) {
                console.log(e);
            }
        });
        it('should create master', async () => {
            try {
                const result = await masters.create({
                    body:
                        {
                            name: 'Гриша',
                            surname: 'Петров',
                            rating: 3,
                            city: 1
                        }
                });
                await result.dataValues.should.be.a('object');
                await result.dataValues.id.should.be.eql(1);
                await result.dataValues.name.should.be.eql('Гриша');
                await result.dataValues.surname.should.be.eql('Петров');
                await result.dataValues.rating.should.be.eql(3);
                await result.dataValues.city_id.should.be.eql(1);
            } catch (e) {
                console.log(e);
            }

        });
    });
    describe('Edit master function', async () => {
        beforeEach(async () => {
            try {
                await mastersModel.destroy({
                    where: {},
                    truncate: true,
                });
                await citiesModel.destroy({
                    where: {},
                    truncate: true,
                });
                await cities.create({newcity: 'Львов'});
                await cities.create({newcity: 'Днепр'});
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
        it('should edit master name, surname, rating, city', async () => {
            try {
                const result = await masters.edit({
                    body:
                        {
                            name: 'Андрей',
                            surname: 'Иванов',
                            rating: 5,
                            city: 2,
                            id: 1
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
    describe('Remove master function', async () => {
        beforeEach(async () => {
            try {
                await mastersModel.destroy({
                    where: {},
                    truncate: true,
                });
                await citiesModel.destroy({
                    where: {},
                    truncate: true,
                });
                await cities.create({newcity: 'Львов'});
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
        it('should remove master', async () => {
            try {
                const result = await masters.delete({query: {id: 1}});
                await result.should.be.a('number');
                await result.should.be.eql(1);
            } catch (e) {
                console.log(e);
            }

        });
    });
    describe('GerFreeMaster master function', async () => {
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
        it('should show free master', async () => {
            try {
                const result = await masters.getFreeMaster({
                    query: {
                        option:'new',
                        city:1,
                        datetime: '2019-02-17T15:00:00.000Z',
                        size: 1
                    }
                });
                await result[0].dataValues.should.be.a('object');
                await result[0].dataValues.id.should.be.eql(1);
                await result[0].dataValues.name.should.be.eql('Гриша');
                await result[0].dataValues.surname.should.be.eql('Петров');
                await result[0].dataValues.rating.should.be.eql(3);
                await result[0].dataValues.city_id.should.be.eql(1);
            } catch (e) {
                console.log(e);
            }

        });
        it('should show the same master as in the order', async () => {
            try {
                const result = await masters.getFreeMaster({
                    query: {
                        option:1,
                        city:1,
                        datetime: '2019-02-17T23:00:00.000Z',
                        size: 1
                    }
                });
                await result[0].dataValues.should.be.a('object');
                await result[0].dataValues.id.should.be.eql(1);
                await result[0].dataValues.name.should.be.eql('Гриша');
                await result[0].dataValues.surname.should.be.eql('Петров');
                await result[0].dataValues.rating.should.be.eql(3);
                await result[0].dataValues.city_id.should.be.eql(1);
            } catch (e) {
                console.log(e);
            }

        });
        it('should return array with length eql 0', async () => {
            try {
                let result = await masters.getFreeMaster({
                    query: {
                        option: 'new',
                        city: 1,
                        datetime: '2019-02-17T23:00:00.000Z',
                        size: 1
                    }
                });
                await result.should.be.a('array');
                await result.length.should.be.eql(0);
            } catch (e) {
                console.log(e);
            }

        });
    });
});