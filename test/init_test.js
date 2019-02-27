const db = require('../settings/sequelize');

const test = {
	destroy: async () => {
		return db.transaction(async (t) => {
			let options = { raw: true, transaction: t };
			await db.query('SET FOREIGN_KEY_CHECKS = 0', options);

			await db.query('DELETE FROM cities;', options);
			await db.query('ALTER TABLE cities AUTO_INCREMENT = 1;', options);

			await db.query('DELETE FROM masters;', options);
			await db.query('ALTER TABLE masters AUTO_INCREMENT = 1;', options);

			await db.query('DELETE FROM clients;', options);
			await db.query('ALTER TABLE clients AUTO_INCREMENT = 1;', options);

			await db.query('DELETE FROM orders;', options);
			await db.query('ALTER TABLE orders AUTO_INCREMENT = 1;', options);

			await db.query('DELETE FROM paypal;', options);
			await db.query('ALTER TABLE paypal AUTO_INCREMENT = 1;', options);

			await db.query('DELETE FROM products;', options);
			await db.query('ALTER TABLE products AUTO_INCREMENT = 1;', options);

			await db.query('DELETE FROM refund;', options);
			await db.query('ALTER TABLE refund AUTO_INCREMENT = 1;', options);

			await db.query('DELETE FROM webhooks;', options);
			await db.query('ALTER TABLE webhooks AUTO_INCREMENT = 1;', options);

			await db.query('SET FOREIGN_KEY_CHECKS = 1', options);
		});
	},

};

module.exports = test;