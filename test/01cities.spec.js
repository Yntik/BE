const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style


const test = require('./init_test');

const cities = require('../controllers/cities');

const citiesModel = require('../models/cities');

describe('CitiesController', async () => {
    before('Remove all constraint', async () => {
        //await test.removeConstraint();
        await test.destroy();
    });
    after('Add all constraint', async () => {
        // await test.addConstraint()
    });
    describe('Get cities function', async () => {
        beforeEach(async () => {
            await citiesModel.destroy({
                where: {},
                truncate: true,
            });
            await cities.create({newcity: 'Львов'});
        });
        it('should show city name\'s Львов', async () => {
            const result = await cities.get();
            await result[0].dataValues.should.be.a('object');
            await result[0].dataValues.id.should.be.eql(1);
            await result[0].dataValues.city.should.be.eql('Львов');
        });
    });
    describe('Create city function', async () => {
        beforeEach(async () => {
            await citiesModel.destroy({
                where: {},
                truncate: true,
            });
        });
        it('should create city name\'s Днепр', async () => {
            const result = await cities.create({newcity: 'Днепр'});
            await result.dataValues.should.be.a('object');
            await result.dataValues.city.should.be.eql('Днепр');
        });
    });
    describe('Edit city function', async () => {
        beforeEach(async () => {
            await citiesModel.destroy({
                where: {},
                truncate: true,
            });
            await cities.create({newcity: 'Львов'});
        });
        it('should edit city name\'s Львов to Днепр', async () => {
            const result = await cities.edit({editcity: 'Днепр', id: 1});
            await result.should.be.a('array');
            await result.length.should.be.eql(1);
            await result[0].should.be.eql(1);
        });
    });
    describe('Remove city function', async () => {
        beforeEach(async () => {
            await citiesModel.destroy({
                where: {},
                truncate: true,
            });
            await cities.create({newcity: 'Львов'});
        });
        it('should remove paypal store', async () => {
            const result = await cities.delete({query: {id: 1}});
            await result.should.be.a('number');
            await result.should.be.eql(1);
        });
    });
});


