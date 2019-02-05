const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

const fs = require("fs");

const cities = require('../controllers/cities');
const masters = require('../controllers/masters');
const products = require('../controllers/products');
const orders = require('../controllers/orders');


const add_data = {
    init:  ()=> {
        describe('Add data', () => {
            let tempDATA = {
                cities: [],
                masters: [],
                products: [],
                orders: []
            };
            let result;
            before(() => {
                fs.truncateSync("./spectator/tempDATA.json");
            });
            it('add city, name : `Днепр`', async () => {
                result = await cities.create({newcity: "Днепр"});
                tempDATA.cities.push(result.dataValues);
                await assert.deepEqual(result.dataValues, {id: tempDATA.cities[0].id,city: "Днепр"});
            });
            it('add city, name : `Ужгород`', async () => {
                result = await cities.create({newcity: "Ужгород"});
                tempDATA.cities.push(result.dataValues);
                await assert.deepEqual(result.dataValues, {id: tempDATA.cities[1].id,city: "Ужгород"});
            });
            it('add master, name : `Женя`, surname: `Гришков`, rating: 5', async () => {
                result = await masters.create({
                    body: {
                        name: "Женя",
                        surname: "Гришков",
                        rating: 5,
                        city: tempDATA.cities[0].id
                    }
                });
                tempDATA.masters.push(result.dataValues);
                await assert.deepEqual(result.dataValues, {
                    id: tempDATA.masters[0].id,
                    name: "Женя",
                    surname: "Гришков",
                    rating: 5,
                    city_id: tempDATA.cities[0].id
                });
            });
            it('add master, name : `Петр`, surname: `Питрович`, rating: 2', async () => {
                result = await masters.create({
                    body: {
                        name: "Петр",
                        surname: "Питрович",
                        rating: 2,
                        city: tempDATA.cities[1].id
                    }
                });
                tempDATA.masters.push(result.dataValues);
                await assert.deepEqual(result.dataValues, {
                    id: tempDATA.masters[1].id,
                    name: "Петр",
                    surname: "Питрович",
                    rating: 2,
                    city_id: tempDATA.cities[1].id
                });

            });
            it('add product, price: `10`, size: 1', async () => {
                result = await products.create({
                    body: {
                        size: 1,
                        price: "10",
                    }
                });
                tempDATA.products.push(result.dataValues);
                await assert.deepEqual(result.dataValues, {id: tempDATA.products[0].id, size: 1, price: "10"});
            });
            it('add product, price: `20`, size: 2', async () => {
                result = await products.create({
                    body: {
                        size: 2,
                        price: "20",
                    }
                });
                tempDATA.products.push(result.dataValues);
                await assert.deepEqual(result.dataValues, {id: tempDATA.products[1].id, size: 2, price: "20"});
            });
            it('add order:', async (done) => {
                let order = {
                    client: "Андрей",
                    email: "adrew@trata.com",
                    city: tempDATA.cities[0].id,
                    product: tempDATA.products[0].id,
                    master: tempDATA.masters[0],
                    datetime: "2019-02-17T23:00:00.000Z",
                    size: tempDATA.products[0].size
                };
                done();
                const result = await orders.create({body: {...order}});
                tempDATA.orders.push(result.dataValues);
                let end = new Date(order.datetime);
                end.setHours(end.getHours() + Number(order.size));
                await assert.deepEqual(result.dataValues, {
                    id: result.dataValues.id,
                    price: tempDATA.products[0].price,
                    product_id: order.product,
                    city_id: order.city,
                    master_id: order.master.id,
                    start: new Date(order.datetime),
                    end: end,
                    paypal_id: result.dataValues.paypal_id,
                    client_id: result.dataValues.client_id
                });
            });
            after(async () => {
                fs.appendFileSync("./spectator/tempDATA.json", `${JSON.stringify(tempDATA)}`);
            });
        });
    }
};



module.exports = add_data;