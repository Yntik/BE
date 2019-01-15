const Masters = require('../models/masters');
const Orders = require('../models/orders');
const Cities = require('../models/cities');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const master = {

    getFreeMaster: async ({query}) => {

        let start = new Date(String(query.datetime));
        let end = new Date(String(query.datetime));
        end.setHours(end.getHours() + Number(query.size));

        let result;
        if (query.option === 'new') {
            console.log('free master for new order');
            result = await Orders.findAll({
                attributes: ['idmaster'],
                where: {
                    [Op.or]: [
                        {
                            [Op.and]: [
                                {
                                    start: {
                                        [Op.lte]: start
                                    },
                                    end: {
                                        [Op.gte]: start
                                    }
                                }]
                        },
                        {
                            [Op.and]: [
                                {
                                    start: {
                                        [Op.lte]: end
                                    },
                                    end: {
                                        [Op.gte]: end
                                    }
                                }
                            ]
                        }
                    ]
                }
            });
            console.log('resssult', result);
            // sql = 'SELECT masters.id, masters.name, masters.surname, masters.idcity, masters.rating, cities.city\n'
            //     + "FROM masters\n"
            //     + "LEFT JOIN cities ON masters.idcity = cities.id\n"
            //     + "WHERE cities.id = " + mysql.escape(decodeURI(query.city)) + "\n"
            //     + "AND masters.id NOT IN (" + "\n"
            //     + "SELECT idmaster FROM orders WHERE start <= " + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" + "\n"
            //     + "OR start <= " + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end )";
        }
        else {
            result = await Orders.findAll({
                attributes: ['idmaster'],
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                {
                                    [Op.and]: [
                                        {
                                            start: {
                                                [Op.lte]: start
                                            },
                                            end: {
                                                [Op.gte]: start
                                            }
                                        }]
                                },
                                {
                                    [Op.and]: [
                                        {
                                            start: {
                                                [Op.lte]: end
                                            },
                                            end: {
                                                [Op.gte]: end
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            id: {
                                [Op.ne]: Number(query.option)
                            }
                        }
                    ]

                }
            });
            console.log('resssult', result);
            // sql = 'SELECT masters.id, masters.name, masters.surname, masters.idcity, masters.rating, cities.city\n '
            //     + "FROM masters\n"
            //     + "LEFT JOIN cities ON masters.idcity = cities.id\n"
            //     + "WHERE cities.id = " + mysql.escape(decodeURI(query.city)) + "\n"
            //     + "AND masters.id NOT IN (" + "\n"
            //     + "SELECT idmaster FROM orders WHERE (start <= " + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" + "\n"
            //     + "OR start <= " + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end) AND NOT orders.id = " + mysql.escape(Number(query.option)) + ")";
        }
        let ids_masters = [];
        for (var key in result) {
            ids_masters.push(result[key].idmaster)
        }
        result = await Masters.findAll({
            where: {
                [Op.and]: [
                    {
                        idcity: decodeURI(query.city)
                    },
                    {
                        id: {
                            [Op.notIn]: ids_masters
                        }
                    }
                ]
            },
            include: {model: Cities}
        });
        console.log('resultl2', result);
        return result;
    },

    get: async () => {
        return await Masters.findAll({
            include: {model: Cities}
        });
    },

    create: async ({body}) => {
        return await Masters.build({
            name: body.name,
            surname: body.surname,
            rating: body.rating,
            idcity: body.city
        }).save()
    },

    edit: async ({body}) => {
        return await Masters.update({
            name: body.name,
            surname: body.surname,
            rating: body.rating,
            idcity: body.city
        }, {where: {id: body.id}})
    },

    delete: async ({query}) => {
        console.log('delete init');
        return await Masters.destroy({where: {id: Number(query.id)}})
    }

};


module.exports = master;