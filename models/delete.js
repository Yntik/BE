const mysql = require('mysql');
const mypool = require('../settings/MyPool');

const _delete = {


	delete: async ({query, con}) => {
		let flag = false ;
		if(con === undefined) {
			con = await mypool.getCon();
			flag = true;
		}
		console.log('delete init');
		const sql = 'DELETE FROM '
            + query.route
            + ' WHERE id = ' + mysql.escape(Number(query.id));
		const result = await con.query(sql);
		if(flag) con.release();
		return result;
	},
};


module.exports = _delete;