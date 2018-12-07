const mysql = require('mysql')
const mypool = require('../settings/MyPool')

const _delete = {


    delete: ({query}) => {
        return mypool.getCon()
            .then((con) => {
                console.log('delete init');
                var sql = "DELETE FROM "
                    + query.route
                    + " WHERE id = " + mysql.escape(Number(query.id));

                return new Promise((resolve, reject) => {
                    con.query(sql, function (err, result) {
                        if (err) {
                            console.log(err);
                            reject(err);
                            return;
                        }
                        con.release();
                        resolve(result);
                    })
                });
            });
    },

};


module.exports = _delete;