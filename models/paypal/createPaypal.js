const mypool = require('../../settings/MyPool');

const createPaypal = {


    createPaypal: () => {
        return mypool.getCon()
            .then(con => {

                var sql = "INSERT INTO paypal () VALUES ();";

                return new Promise((resolve, reject) => {
                    con.query(sql, (err, result) => {
                        if (err) {
                            con.rollback(function () {
                                return reject(err);
                            })
                        }
                        con.release();
                        resolve(result);
                    })
                });
            });
    }

};


module.exports = createPaypal;