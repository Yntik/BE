const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

const fs = require("fs");

const cities = require('../controllers/cities');
const masters = require('../controllers/masters');
const products = require('../controllers/products');

const modelMasters = require('../models/masters');
const modelCities = require('../models/cities');
const modelProducts = require('../models/product');

describe('Add data', () => {
    let tempDATA = {
        cities: [],
        masters: [],
        products: []
    };
    let result;
    before(async () => {
        fs.truncateSync("./spectator/tempDATA.json");

    });
    it('add city, name : `Днепр`', async () => {
        result = await cities.create({newcity: "Днепр"});
        tempDATA.cities.push(result.dataValues);
        assert.deepEqual(result.dataValues, {id: tempDATA.cities[0].id,city: "Днепр"});
    });
    it('add city, name : `Ужгород`', async () => {
        result = await cities.create({newcity: "Ужгород"});
        tempDATA.cities.push(result.dataValues);
        assert.deepEqual(result.dataValues, {id: tempDATA.cities[1].id,city: "Ужгород"});
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
        assert.deepEqual(result.dataValues, {
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
        assert.deepEqual(result.dataValues, {
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
        assert.deepEqual(result.dataValues, {id: tempDATA.products[0].id, size: 1, price: "10"});
    });
    it('add product, price: `20`, size: 2', async () => {
        result = await products.create({
            body: {
                size: 2,
                price: "20",
            }
        });
        tempDATA.products.push(result.dataValues);
        assert.deepEqual(result.dataValues, {id: tempDATA.products[1].id, size: 2, price: "20"});
    });
    after(async () => {
        fs.appendFileSync("./spectator/tempDATA.json", `${JSON.stringify(tempDATA)}`);
        modelMasters.destroy({
            where: {}
        });
        modelCities.destroy({
            where: {},
        });
        modelProducts.destroy({
            where: {}
        });
    })
});

module.exports = describe;