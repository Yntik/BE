const config = require ('../database');
const OPTION = {
    MYSQL_OPTION : {
        host: "uoa25ublaow4obx5.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "kgdmym5x73zjg6ht",
        password: "b9eks97n4gxdky5x",
        port: "3306",
        database: "f5wf6itanzdumyuo"
    },
    POOL_OPTION : {
        connectionLimit : 10,
        host: config.dev.host,
        user: config.dev.user,
        password: config.dev.password,
        port: config.dev.port,
        database: config.dev.database
    }
};

module.exports = OPTION;