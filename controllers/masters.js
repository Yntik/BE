const Masters = require('../models/masters');
const Orders = require('../models/orders');
const Cities = require('../models/cities');
const Sequelize = require('sequelize');
const mysql = require('mysql');
const Op = Sequelize.Op;
const master = {

    getFreeMaster: async ({query}) => {
        let start = new Date(String(query.datetime));
        let Timezone = start.getTimezoneOffset() / 60;
        let end = new Date(String(query.datetime));
        end.setHours(end.getHours() + Number(query.size) + Timezone);
        start.setHours(start.getHours() + Timezone);
        let result;
        let subQuery;
        if (query.option === 'new') {
            // console.log('free master for new order');
            subQuery = "SELECT master_id FROM orders WHERE start <= " + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" + "\n"
                + "OR start <= " + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end";
            // console.log('free master for new order');
            // sql = 'SELECT masters.id, masters.name, masters.surname, masters.idcity, masters.rating, cities.city\n'
            //     + "FROM masters\n"
            //     + "LEFT JOIN cities ON masters.idcity = cities.id\n"
            //     + "WHERE cities.id = " + mysql.escape(decodeURI(query.city)) + "\n"
            //     + "AND masters.id NOT IN (" + "\n"
            //     + "SELECT idmaster FROM orders WHERE start <= " + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" + "\n"
            //     + "OR start <= " + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end )";
        }
        else {
            // console.log('free master for old order');
            subQuery = "SELECT master_id FROM orders WHERE (start <= " + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" + "\n"
                + "OR start <= " + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end) AND NOT orders.id = " + mysql.escape(Number(query.option));
            // sql = 'SELECT masters.id, masters.name, masters.surname, masters.idcity, masters.rating, cities.city\n '
            //     + "FROM masters\n"
            //     + "LEFT JOIN cities ON masters.idcity = cities.id\n"
            //     + "WHERE cities.id = " + mysql.escape(decodeURI(query.city)) + "\n"
            //     + "AND masters.id NOT IN (" + "\n"
            //     + "SELECT idmaster FROM orders WHERE (start <= " + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" + "\n"
            //     + "OR start <= " + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end) AND NOT orders.id = " + mysql.escape(Number(query.option)) + ")";
        }
        result = await Masters.findAll({
            where: {
                [Op.and]: [
                    {
                        city_id: decodeURI(query.city)
                    },
                    {
                        id: {
                            [Op.notIn]: [Sequelize.literal(subQuery)]
                        }
                    }
                ]
            },
        });
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
            city_id: body.city
        }).save()
    },

    edit: async ({body}) => {
        return await Masters.update({
            name: body.name,
            surname: body.surname,
            rating: body.rating,
            city_id: body.city
        }, {where: {id: body.id}})
    },

    delete: async ({query}) => {
        return await Masters.destroy({where: {id: Number(query.id)}})
    }

};


module.exports = master;