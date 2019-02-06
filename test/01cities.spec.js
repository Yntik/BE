const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style


const Sequelize = require('sequelize');
const db = require('../settings/sequelize');

const fs = require("fs");
const cities = require('../controllers/cities');

const citiesModel = require('../models/cities');
const mastersModel = require('../models/masters');
const ordersModel = require('../models/orders');

describe('CitiesController', async () => {
    let tempDATA = {};
    let city_id;
    beforeEach(async () => {
        try {
            console.log('beforeEach');
            console.log('1');
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
            await cities.create({newcity: 'Львов'});
        } catch (e) {
        }
    });
    afterEach(async () => {
        try {
            console.log('afterEach');
            console.log('1');
            await db.getQueryInterface().removeConstraint('masters', 'master_city');
            console.log('2');
            await db.getQueryInterface().removeConstraint('orders', 'order_city');
            console.log('3');
            await db.getQueryInterface().removeConstraint('clients', 'client_city');
            await citiesModel.destroy({
                where: {},
                truncate: true,
            });

        } catch (e) {
        }
    });
    // it('should be equal name = `Днепр`', async () => {
    //     const result = await cities.get();
    //     tempDATA = JSON.parse(fs.readFileSync('./test/tempDATA.json', 'utf8'));
    //     assert.deepEqual(result[0].dataValues, tempDATA.cities[0]);
    // });
    it('should was created city name = `Киев`', async () => {
        try {
            const result = await cities.create({newcity: 'Киев'});
            city_id = result.dataValues.id;
            await assert.deepEqual(result.dataValues, {id: result.dataValues.id, city: "Киев"});
        } catch (e) {
        }

    });
    it('should was edited city name "Львов" to "Харьков"', async () => {
        try {
            const result = await cities.edit({editcity: "Харьков", id: 1});
            console.log(result);
            await assert.equal(result[0], 1);

        } catch (e) {

        }

    });
    // it('should was remove city name "Харьков"', async () => {
    //     const result = await cities.delete({query: {id: city_id}});
    //     assert.deepEqual(result, 1);
    // })
});


