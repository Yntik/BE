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
    return db.createTable('paypal', {
        columns: {
            id: { type: 'int', primaryKey: true, notNull: true, autoIncrement: true },
            state_payment: {type: 'int', defaultValue: 0, notNull: true},
            paypal_id: {type: 'string', defaultValue: 1}
        },
        ifNotExists: true
    });
};

exports.down = function (db) {
    return db.dropTable('paypal');
};

exports._meta = {
  "version": 1
};
