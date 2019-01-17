const Sequelize = require('sequelize');
const config = require ('../database');

module.exports =  new Sequelize(config.dev.database, config.dev.user, config.dev.password, {
    host: config.dev.host,
    dialect: 'mysql',
    define: {
        timestamps: false,
        freezeTableName: true
    },
    operatorsAliases: false,

    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
        port: config.dev.port,
    },
});