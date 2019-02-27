const config = require('./MYSQL_OPTION');

// var pool = MyPool.createPool(config.POOL_OPTION);
const mysql_promise = require('promise-mysql');
const pool = mysql_promise.createPool(config.POOL_OPTION);


let MySQL = {


	// getCon: () => {
	//     return new Promise((resolve, reject) => {
	//         pool.getConnection((err, con) => {
	//             if (err) {
	//                 console.log(err)
	//                 return reject(err)
	//             }
	//             resolve(con)
	//         })
	//     })
	//
	//
	// }
	getCon: () =>{
		try {
			return pool.getConnection();
		} catch (err) {
			throw new Error(err);
		}

	}
};


module.exports = MySQL;