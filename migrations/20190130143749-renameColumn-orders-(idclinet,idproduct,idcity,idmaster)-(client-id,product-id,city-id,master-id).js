'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = async function (db) {
    await db.renameColumn('orders', 'idcity', 'city_id');
    await db.renameColumn('orders', 'idclient', 'client_id');
    await db.renameColumn('orders', 'idmaster', 'master_id');
    await db.renameColumn('orders', 'idpaypal', 'paypal_id');
    return db.renameColumn('orders', 'idproduct', 'product_id');

};

exports.down = async function (db) {
    await db.renameColumn('orders', 'city_id', 'idcity');
    await db.renameColumn('orders', 'client_id', 'idclient');
    await db.renameColumn('orders', 'master_id', 'idmaster');
    await db.renameColumn('orders', 'paypal_id', 'idpaypal');
    return db.renameColumn('orders', 'product_id', 'idproduct');
};

exports._meta = {
    "version": 1
};
