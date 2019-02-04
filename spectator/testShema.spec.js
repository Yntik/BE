const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style
const before = require('./before.spec');


describe('testing start',async () => {
    await before;
});