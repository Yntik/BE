const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

const add_data = require('./before.spec');
const citiesTests = require('./cities.spec');
const productsTests = require('./products.spec')
const delete_data = require('./after.spec');


describe('testing start',async () => {
    describe('1', async () => {
        await add_data.init();
    });
    describe('2', async () => {
        await citiesTests.init();
    });
    describe('3', async () => {
        await productsTests.init();
    });
    describe('10', async () => {
        await delete_data.remove();
    });
});