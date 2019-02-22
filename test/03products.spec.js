const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style


const test = require('./init_test');

const products = require('../controllers/products');

const productModel = require('../models/product');

describe('ProductsController', async () => {
    before('Remove all constraint', async () => {
        // await test.removeConstraint();
        await test.destroy();
    });
    after('Add all constraint', async () => {
        // await test.addConstraint()
    });
    describe('Get product function', async () => {
        beforeEach(async () => {
            await test.destroy();
            await products.create({body: {size: 1, price: '10'}});
        });
        it('should show product size 1, price 10', async () => {
            const result = await products.get();
            await result[0].dataValues.should.be.a('object');
            await result[0].dataValues.id.should.be.eql(1);
            await result[0].dataValues.size.should.be.eql(1);
            await result[0].dataValues.price.should.be.eql('10');
        });
    });
    describe('Get product by id function', async () => {
        beforeEach(async () => {
            await test.destroy();
            await products.create({body: {size: 1, price: '10'}});
        });
        it('should show product by  id = 1', async () => {
            let product_id = 1;
            const result = await products.get(product_id);
            await result.dataValues.should.be.a('object');
            await result.dataValues.id.should.be.eql(1);
            await result.dataValues.size.should.be.eql(1);
            await result.dataValues.price.should.be.eql('10');
        });
    });
    describe('Create product function', async () => {
        beforeEach(async () => {
            await test.destroy();
        });
        it('should create product', async () => {
            const result = await products.create({body: {size: 1, price: '10'}});
            await result.dataValues.should.be.a('object');
            await result.dataValues.id.should.be.eql(1);
            await result.dataValues.size.should.be.eql(1);
            await result.dataValues.price.should.be.eql('10');
        });
    });
    describe('Edit product function', async () => {
        beforeEach(async () => {
            await test.destroy();
            await products.create({body: {size: 1, price: '10'}});
        });
        it('should edit product', async () => {
            const result = await products.edit({
                body:
                    {
                        price: '20',
                        size: 2,
                        id: 1
                    }
            });
            await result.should.be.a('array');
            await result.length.should.be.eql(1);
            await result[0].should.be.eql(1);
        });
    });
    describe('Remove product function', async () => {
        beforeEach(async () => {
            await test.destroy();
            await products.create({body: {size: 1, price: '10'}});
        });
        it('should remove product', async () => {
            const result = await products.delete({query: {id: 1}});
            await result.should.be.a('number');
            await result.should.be.eql(1);
        });
    });
});


