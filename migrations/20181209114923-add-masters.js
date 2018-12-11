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
    return db.createTable('masters', {
        columns: {
            id: { type: 'int', primaryKey: true, notNull: true, autoIncrement: true },
            name: {type: 'string', notNull: true},
            surname: {type: 'string', notNull: true},
            rating: {type: 'int', notNull: true},
            idcity: {type: 'int', notNull: true}
        },
        ifNotExists: true
    });
};

exports.down = function (db) {
    return db.dropTable('masters');
};


exports._meta = {
  "version": 1
};
