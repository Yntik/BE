const Cities = require('../models/cities');
const cities = {
    get: async () => {
        return await Cities.findAll();
    },


    create: async ({newcity}) => {
        return await Cities.build({ city: newcity }).save()
    },

    edit: async ({editcity, id}) => {
        return await Cities.update({ city: editcity }, { where: { id: id} })
    },

    delete: async ({query}) => {
        return await Cities.destroy({ where: { id: Number(query.id) }})
    }
};



module.exports = cities;