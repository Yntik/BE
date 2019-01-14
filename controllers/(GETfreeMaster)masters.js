const Masters = require('../models/masters')
const mysql = require('mysql');
const mypool = require('../settings/MyPool');
const master = {

    getFreeMaster: async ({query}) => {
        const con = await mypool.getCon();

        const start = new Date(String(query.datetime));
        const end = new Date(String(query.datetime));
        end.setHours(end.getHours() + Number(query.size));

        var sql = '';
        if (query.option === 'new') {
            console.log('free master for new order');
            sql = 'SELECT masters.id, masters.name, masters.surname, masters.idcity, masters.rating, cities.city\n'
                + "FROM masters\n"
                + "LEFT JOIN cities ON masters.idcity = cities.id\n"
                + "WHERE cities.id = " + mysql.escape(decodeURI(query.city)) + "\n"
                + "AND masters.id NOT IN (" + "\n"
                + "SELECT idmaster FROM orders WHERE start <= " + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" + "\n"
                + "OR start <= " + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end )";
        }
        else {
            sql = 'SELECT masters.id, masters.name, masters.surname, masters.idcity, masters.rating, cities.city\n '
                + "FROM masters\n"
                + "LEFT JOIN cities ON masters.idcity = cities.id\n"
                + "WHERE cities.id = " + mysql.escape(decodeURI(query.city)) + "\n"
                + "AND masters.id NOT IN (" + "\n"
                + "SELECT idmaster FROM orders WHERE (start <= " + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" + "\n"
                + "OR start <= " + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end) AND NOT orders.id = " + mysql.escape(Number(query.option)) + ")";
        }

        const result = await con.query(sql);
        console.log(result);
        con.release();
        return result;
    },

    get: async () => {
        return await Masters.findAll({
            include: { model: Cities }
        });
    },

    create: async ({body}) => {
        return await Masters.build({ name: body.name, surname: body.surname, rating: body.rating, idcity: body.city}).save()
    },

    edit: async ({body}) => {
        return await Masters.update({ name: body.name, surname: body.surname, rating: body.rating, idcity: body.city}, { where: { id: body.id} })
    },

    delete: async ({query}) => {
        console.log('delete init');
        return await Masters.destroy({ where: { id: Number(query.id) }})
    }

};


module.exports = master;