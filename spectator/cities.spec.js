const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

const fs = require("fs");
const cities = require('../controllers/cities');

const citiesTests = {
    init: () => {
        describe('CitiesController', () => {
            let tempDATA = {};
            let city_id;
            it('should be equal name = `Днепр`', async () => {
                const result = await cities.get();
                tempDATA = JSON.parse(fs.readFileSync('./spectator/tempDATA.json', 'utf8'));
                assert.deepEqual(result[0].dataValues, tempDATA.cities[0]);
            });
            it('should was created city name = `Киев`', async () => {
                const result = await cities.create({newcity: 'Киев'});
                city_id = result.dataValues.id;
                assert.deepEqual(result.dataValues, {id: result.dataValues.id, city: "Киев"});
            });
            it('should was edited city name "Киев" to "Харьков"', async () => {
                const result = await cities.edit({editcity: "Харьков", id: city_id});
                assert.deepEqual(result[0], 1);
            })
            it('should was remove city name "Харьков"', async () => {
                const result = await cities.delete({query: {id: city_id}});
                assert.deepEqual(result, 1);
            })
        });
    }
};


module.exports = citiesTests;

