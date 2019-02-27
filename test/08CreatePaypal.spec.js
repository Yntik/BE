const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style


const test = require('./init_test');

const createPaypal = require('../controllers/paypal/createPaypal');



describe('CreatePaypalController', async () => {
	before('Remove all constraint', async () => {
		// await test.removeConstraint();
		await test.destroy();
	});
	after('Add all constraint', async () => {
		// await test.addConstraint()
	});
	describe('Create paypal function', async () => {
		beforeEach(async () => {
			await test.destroy();
		});
		it('should create paypal', async () => {
			const result = await createPaypal.createPaypal({});
			await result.dataValues.should.be.a('object');
			await result.dataValues.id.should.be.eql(1);
			await result.dataValues.paypal_id.should.be.eql(true);
			await result.dataValues.webhook.should.be.eql(true);
		});
	});
	describe('Get paypal function', async () => {
		beforeEach(async () => {
			await test.destroy();
			await createPaypal.createPaypal({});
		});
		it('should show paypal', async () => {
			const result = await createPaypal.get({paypal_id: 1});
			await result.dataValues.should.be.a('object');
			await result.dataValues.id.should.be.eql(1);
			await result.dataValues.paypal_id.should.be.eql('1');
			await result.dataValues.state_payment.should.be.eql(0);
			await result.dataValues.webhook.should.be.eql(true);


		});
		it('don\'t should show create paypal', async () => {
			expect(async () => await createPaypal.get({}).to.throw('SequelizeDatabaseError: Unknown column NaN in where clause'));
		});
	});
	describe('Remove paypal function', async () => {
		beforeEach(async () => {
			await test.destroy();
			await createPaypal.createPaypal({});
		});
		it('should remove paypal', async () => {
			const result = await createPaypal.delete({query: {id: 1}});
			await result.should.be.a('number');
			await result.should.be.eql(1);
		});
	});

});


