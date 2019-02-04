const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style
const citiesSpec = require('../controllers/cities');


describe('CitiesController',function () {
    it('should return json object  city of `Бангкок`',async  function () {
        const result = await citiesSpec.get();
        assert.deepEqual(result[0].dataValues, {id: 32,city: "Брюсель"});
    });
});



