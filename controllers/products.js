const Products = require('../models/product');
const product = {
	get: async (product_id) => {
		let result;
		if (product_id === undefined) {
			result = await Products.findAll();
			return result;

		}
		else {

			result = await Products.findAll({
				where: {
					id: product_id,
				}
			});
			return result[0];
		}
	},

	create: async ({body}) => {
		return await Products.build({size: body.size, price: body.price}).save();
	},

	edit: async ({body}) => {
		return await Products.update({size: body.size, price: body.price}, {where: {id: body.id}});
	},

	delete: async ({query}) => {
		return await Products.destroy({where: {id: Number(query.id)}});
	}

};


module.exports = product;