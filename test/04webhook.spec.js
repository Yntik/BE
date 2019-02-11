const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style


const test = require('./init_test');

const webhooks = require('../controllers/paypal/webhook');
const webhookModel = require('../models/webhooks');

describe('WebhookController', async () => {
    before('Remove all constraint', async () => {
        await test.removeConstraint();
        await test.destroy();
    });
    after('Add all constraint', async () => {
        await test.addConstraint()
    });
    describe('Store webhook function', async () => {
        beforeEach(async () => {
            await webhookModel.destroy({
                where: {},
                truncate: true,
            });
        });
        it('should store webhook', async () => {
            let body = {
                about: 'store webhook',
                json: 'true'
            };
            let order = {
                id: 1
            };
            let state_verify = 1;
            let paypal_id = 'paypal_id hash';
            const result = await webhooks.storeWebhook(body, order, state_verify, paypal_id);
            await result.dataValues.should.be.a('object');
            await result.dataValues.id.should.be.eql(1);
            await result.dataValues.body.should.be.eql(JSON.stringify(body));
            await result.dataValues.state_verify.should.be.eql(1);
            await result.dataValues.paypal_id.should.be.a('string');
            await result.dataValues.paypal_id.should.be.eql(paypal_id);
        });
    });
    describe('Get webhook function', async () => {
        let body = {
            about: 'store webhook',
            json: 'true'
        };
        let order = {
            id: 1
        };
        let state_verify = 1;
        let paypal_id = 'paypal_id_hash';
        beforeEach(async () => {
            await webhookModel.destroy({
                where: {},
                truncate: true,
            });
            await webhooks.storeWebhook(body, order, state_verify, paypal_id);
        });
        it(`should get webhook by paypal_id = ${paypal_id}`, async () => {
            const result = await webhooks.get({paypal_id: paypal_id});
            await result.dataValues.should.be.a('object');
            await result.dataValues.id.should.be.eql(1);
            await result.dataValues.body.should.be.eql(JSON.stringify(body));
            await result.dataValues.state_verify.should.be.eql(1);
            await result.dataValues.paypal_id.should.be.a('string');
            await result.dataValues.paypal_id.should.be.eql(paypal_id);

        });
    });
});


