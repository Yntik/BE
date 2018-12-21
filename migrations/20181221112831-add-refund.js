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
    return db.createTable('refund', {
        columns: {
            id: { type: 'int', primaryKey: true, notNull: true, autoIncrement: true },
            paypal_id: {type: 'string', notNull: true },
            body: {type: 'JSON', notNull: true }
        },
        ifNotExists: true
    });
};

exports.down = function (db) {
    return db.dropTable('refund');
};

exports._meta = {
  "version": 1
};
