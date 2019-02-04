const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style
const citiesSpec = require('../controllers/cities');


describe('WebSocket test after', () => {
    afterEach(() => {
        console.log('after');
        it('should return json object  city of `Бангкок`',async () => {
            console.log('eee')
            const result = await citiesSpec.get({newcity: "Днепр"});
            assert.deepEqual(result[0].dataValues, {id: 32,city: "Брюсель"});
        });
    });
    it('should return json object  city of `Бангкок`',async  function () {
    });
});