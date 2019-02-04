const Sequelize = require('sequelize');
const config = require ('../settings/config');
module.exports =  new Sequelize(config.DATABASE.dev.database, config.DATABASE.dev.user, config.DATABASE.dev.password, {
    host: config.DATABASE.dev.host,
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
        port: config.DATABASE.dev.port,
    },
});