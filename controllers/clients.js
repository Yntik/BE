const Clients = require('../models/clients');
const Cities = require('../models/cities');
const clients = {


	get: async () => {
		return await Clients.findAll({
			include: { model: Cities }
		});

	},

	edit: async ({name, email, city, id}) => {
		return await Clients.update({name: name, email: email, city_id: city}, {where: {id: id}});
	},

	delete: async ({query}) => {
		return await Clients.destroy({where: {id: Number(query.id)}});
	}

};


module.exports = clients;