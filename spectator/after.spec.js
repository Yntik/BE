const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

const citiesSpec = require('../controllers/cities');

const fs = require("fs");

const modelMasters = require('../models/masters');
const modelCities = require('../models/cities');
const modelProducts = require('../models/product');

const delete_data = {
    remove: () => {
        describe('Delete all data', () => {
            it('Delete all 1`', async function () {
                fs.truncateSync("./spectator/tempDATA.json");
                await modelMasters.destroy({
                    where: {}
                });
                await modelCities.destroy({
                    where: {},
                });
                await modelProducts.destroy({
                    where: {}
                });
            });

        });
    }
}


module.exports = delete_data;