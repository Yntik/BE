const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

const citiesSpec = require('../controllers/cities');

const fs = require("fs");

const modelMasters = require('../models/masters');
const modelCities = require('../models/cities');
const modelProducts = require('../models/product');
const modelOrders = require('../models/orders');
const modelClients = require('../models/clients');


const delete_data = {
    remove: () => {
        describe('Delete all data', (done) => {
            it('Delete orders', async function () {
                fs.truncateSync("./spectator/tempDATA.json");
                await modelOrders.destroy({
                    where: {}
                });
            });
            it('Delete clients', async function () {
                await modelClients.destroy({
                    where: {}
                });
            });
            it('Delete masters', async function () {
                await modelMasters.destroy({
                    where: {}
                });
            });
            it('Delete cities', async function () {
                await modelCities.destroy({
                    where: {},
                });
            });
            it('Delete products', async function () {
                await modelProducts.destroy({
                    where: {}
                });
            });

        });
    }
};

module.exports = delete_data;
