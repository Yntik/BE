const Clients = require('../models/clients');
const Cities = require('../models/cities')
const clients = {


    get: async () => {
        return await Clients.findAll({
            include: { model: Cities }
        });

    },

    edit: async ({name, email, city, id}) => {
        return await Clients.update({name: name, email: email, idcity: city}, {where: {id: id}})
    },

    delete: async ({query}) => {
        console.log('delete init');
        return await Clients.destroy({where: {id: Number(query.id)}})
    }

};


module.exports = clients;