const mypool = require('../settings/MyPool')

const clients = {


    get: () => {
        return mypool.getCon()
            .then((con) => {
                var sql = 'SELECT clients.id, clients.name, clients.email, clients.idcity, citys.city\n '
                    + "FROM clients\n"
                    + "LEFT JOIN citys ON clients.idcity = citys.id\n"
                    + "ORDER BY clients.id DESC" ;

                return new Promise((resolve, reject) => {
                    con.query(sql, function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(result);
                    })
                });
            });
    },


    edit: ({ name, email, city, id }) => {
        return mypool.getCon()
            .then(con => {
                var sql = 'UPDATE clients SET name = ?, email = ?, idcity = ? WHERE id = ?';
                return new Promise((resolve, reject) => {
                    con.query(sql, [
                        name,
                        email,
                        city,
                        id
                    ], function (err, result) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(result);
                    })
                });
            });
    }

};




module.exports = clients;