const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style


const test = require('./init_test');

const createPaypal = require('../controllers/paypal/createPaypal');

const paypalModel = require('../models/paypal');

describe('CreatePaypalController', async () => {
    before('Remove all constraint', async () => {
        await test.removeConstraint();
        await test.destroy();
    });
    after('Add all constraint', async ()=> {
        await test.addConstraint()
    })
    describe('Create paypal function', async () => {
        beforeEach(async () => {
            try {
                await paypalModel.destroy({
                    where: {},
                    truncate: true,
                });
            } catch (e) {
                console.log(e);
            }
        });
        it('should create paypal', async () => {
            try {
                const result = await createPaypal.createPaypal({});

                await result.dataValues.should.be.a('object');
                await result.dataValues.id.should.be.eql(1);
                await result.dataValues.paypal_id.should.be.eql(true);
                await result.dataValues.webhook.should.be.eql(true);
            } catch (e) {
                console.log(e);
            }

        });
    });
    describe('Get paypal function', async () => {
        beforeEach(async () => {
            try {
                await paypalModel.destroy({
                    where: {},
                    truncate: true,
                });
                await createPaypal.createPaypal({});
            } catch (e) {
                console.log(e);
            }
        });
        it('should create paypal', async () => {
            try {
                const result = await createPaypal.get({paypal_id: 1});
                await result.dataValues.should.be.a('object');
                await result.dataValues.id.should.be.eql(1);
                await result.dataValues.paypal_id.should.be.eql('1');
                await result.dataValues.state_payment.should.be.eql(0);
                await result.dataValues.webhook.should.be.eql(true);
            } catch (e) {
                console.log(e);
            }

        });
    });
    describe('Remove paypal function', async () => {
        beforeEach(async () => {
            try {
                await paypalModel.destroy({
                    where: {},
                    truncate: true,
                });
                await createPaypal.createPaypal({});
            } catch (e) {
                console.log(e);
            }
        });
        it('should remove paypal', async () => {
            try {
                const result = await createPaypal.delete({query: {id: 1}});
                await result.should.be.a('number');
                await result.should.be.eql(1);
            } catch (e) {
                console.log(e);
            }

        });
    });

});


