const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

const fs = require("fs");
const products = require('../controllers/products');

const productsTests = {
    init: () => {
        describe('ProductsController', () => {
            let tempDATA = {};
            let product_id;
            it('should be equal price = `10`, size = `1`', async () => {
                tempDATA = JSON.parse(fs.readFileSync('./test/tempDATA.json', 'utf8'));
                const result = await products.get(tempDATA.products[0].id);
                assert.deepEqual(result.dataValues, tempDATA.products[0]);
            });
            it('should be equal all products', async () => {
                const result = await products.get();
                assert.deepEqual([result[0].dataValues, result[1].dataValues], tempDATA.products);
            });
            it('should was created product price = `50`, size = `5`', async () => {
                const result = await products.create({
                    body: {
                        size: 5,
                        price: "50",
                    }
                });
                product_id = result.dataValues.id;
                assert.deepEqual(result.dataValues, {id: result.dataValues.id, size: 5, price: "50"});
            });
            it('should was edited product price = `50`, size = `5` to price = `70`, size = `7`', async () => {
                const result = await products.edit({
                    body: {
                        size: 7,
                        price: "70",
                        id: product_id
                    }
                });
                assert.deepEqual(result[0], 1);
            })
            it('should was remove price = `70`, size = `7`', async () => {
                const result = await products.delete({query: {id: product_id}});
                assert.deepEqual(result, 1);
            })
        });
    }
};


module.exports = productsTests;

