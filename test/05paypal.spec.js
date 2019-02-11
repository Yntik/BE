const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style


const test = require('./init_test');

const paypal = require('../controllers/paypal/paypal');
const cities = require('../controllers/cities');
const products = require('../controllers/products');
const masters = require('../controllers/masters');
const orders = require('../controllers/orders');

const citiesModel = require('../models/cities');
const mastersModel = require('../models/masters');
const clientsModel = require('../models/clients');
const ordersModel = require('../models/orders');
const paypalModel = require('../models/paypal');
const productsModel = require('../models/product');


describe('PaypalController', async () => {
    before('Remove all constraint', async () => {
        await test.removeConstraint();
        await test.destroy();
    });
    after('Add all constraint', async () => {
        await test.addConstraint()
    });
    describe('Edit status of payment', async () => {
        beforeEach(async () => {
                await ordersModel.destroy({
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
                await productsModel.destroy({
                    where: {},
                    truncate: true,
                });
                await citiesModel.destroy({
                    where: {},
                    truncate: true,
                });
                await paypalModel.destroy({
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
                    email: "adrew@trata.com",
                    city: 1,
                    product: 1,
                    master: {
                        id: 1,
                        name: 'Гриша',
                        surname: 'Петров',
                        rating: 3,
                        city_id: 1
                    },
                    datetime: "2019-02-17T23:00:00.000Z",
                    size: 1
                };
                await orders.create({body: {...order}});
        });
        it('should change status payment of order', async () => {
                let body = {
                    resource: {
                        state: 'completed',
                        custom: 1,
                        amount: {
                            total: '10'
                        }
                    }
                };
                let size = 1;// check order up
                let datetime = "2019-02-17T23:00:00.000Z";

                let start = new Date(datetime);
                let end = new Date(datetime);
                end.setHours(end.getHours() + Number(size));

                const result = await paypal.stateChange({body});

                await result.result.should.be.a('array');
                await result.order.should.be.a('array');
                await result.result.length.should.be.eql(1);
                await result.result[0].should.be.eql(1);
                await result.order[0].dataValues.id.should.be.eql(1);
                await result.order[0].dataValues.client_id.should.be.eql(1);
                await result.order[0].dataValues.price.should.be.eql('10');
                await result.order[0].dataValues.product_id.should.be.eql(1);
                await result.order[0].dataValues.city_id.should.be.eql(1);
                await result.order[0].dataValues.master_id.should.be.eql(1);
                await result.order[0].dataValues.paypal_id.should.be.eql(1);
                await result.order[0].dataValues.start.should.be.eql(start);
                await result.order[0].dataValues.end.should.be.eql(end);
        });
    });
});


