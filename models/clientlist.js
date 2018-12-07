const mypool = require('../settings/MyPool')

const clients = {


    get: () => {
        return mypool.getCon()
            .then((con) => {
                console.log('get clients')
                var sql = 'SELECT clients.id, clients.name, clients.email, clients.idcity, cities.city\n '
                    + "FROM clients\n"
                    + "LEFT JOIN cities ON clients.idcity = cities.id\n"
                    + "ORDER BY clients.id DESC";

                return new Promise((resolve, reject) => {
                    con.query(sql, function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        con.release();
                        resolve(result);
                    })
                });
            });
    },


    edit: ({name, email, city, id}) => {
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
                        con.release();
                        resolve(result);
                    })
                });
            });
    }

};


module.exports = clients;