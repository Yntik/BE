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

exports.up = function (db) {
    return db.createTable('products', {
        columns: {
            id: { type: 'int', primaryKey: true, notNull: true, autoIncrement: true },
            size: {type: 'int', notNull: true},
            price: {type: 'string', notNull: true}
        },
        ifNotExists: true
    });
};

exports.down = function (db) {
    return db.dropTable('products');
};

exports._meta = {
  "version": 1
};
