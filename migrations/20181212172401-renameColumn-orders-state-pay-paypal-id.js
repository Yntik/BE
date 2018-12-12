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
    return db.renameColumn('orders', 'state_pay', 'idpaypal');
};

exports.down = function (db) {
    return db.renameColumn('orders', 'idpaypal', 'state_pay');
};

exports._meta = {
  "version": 1
};
