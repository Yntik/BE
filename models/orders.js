const mysql = require('mysql');
const mypool = require('../settings/MyPool');
const nodemailer = require('nodemailer');
const createPaypal = require('./paypal/createPaypal');
const webhookModel = require('./paypal/webhook');
const refundModel = require('./paypal/refund');
const productModel = require('./product');
const deleteModel = require('./delete');
const isEmail = require( "sane-email-validation" );

const order = {

    get: async (order_id) => {
        console.log('get orders init');
        const con = await mypool.getCon();
        var sql;
        if (order_id === undefined) {
            console.log('order id === undefined');
            sql = 'SELECT orders.id, orders.idclient, orders.idpaypal, orders.idmaster, orders.idcity, orders.idproduct, orders.price, orders.start, orders.end, clients.name client, clients.email, masters.name, masters.surname, product.size, cities.city\n'
                + "FROM orders\n"
                + "LEFT JOIN clients ON orders.idclient = clients.id\n"
                + "LEFT JOIN masters ON orders.idmaster = masters.id\n"
                + "LEFT JOIN product ON orders.idproduct = product.id\n"
                + "LEFT JOIN cities ON orders.idcity = cities.id\n"
                + "ORDER BY orders.start DESC";
        }
        else {
            console.log('made query order');
            sql = 'SELECT * FROM orders\n'
                + 'WHERE id = ' + mysql.escape(order_id);
        }
        console.log(sql);
        console.log('select order');
        const result = await con.query(sql);
        con.release();
        return result;
    },

    create: async ({body}) => {
        const con = await mypool.getCon();
        try {
            if (body.client.length < 3) {
                throw new Error('not validation');
            }
            if ( !isEmail( body.email ) ) {
                throw new Error('not validation');
            }
            /* Begin transaction */
            console.log('Begin transaction ');
            await con.query('START TRANSACTION');

            console.log('checkmaster');
            await checkmaster({body: body});

            console.log('checkmasterisfree');
            await checkmasterisfree({body: body});

            let client_id;
            let paypal_id;
            let product;
            console.log('insertclient');
            const result_client = await insertclient({body: body, con: con});
            client_id = result_client.insertId;
            console.log('checkproduct');
            product = await productModel.get(body.product);
            console.log('createPaypal');
            const result_paypal = await createPaypal.createPaypal({con: con});
            paypal_id = result_paypal.insertId;
            console.log('insertorder', paypal_id);
            const result_order = await insertorder({
                body: body,
                product: product,
                client_id: client_id,
                paypal_id: paypal_id,
                con: con
            });
            console.log('do commit');
            await con.query('COMMIT');
            con.release();
            console.log('Transaction Complete.');
            /* End transaction */
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'clockwiseclockware@gmail.com',
                    pass: 'passwordsecret'
                }
            });
            console.log('created');
            transporter.sendMail({
                from: 'clockwiseclockware@gmail.com',
                to: body.email,
                subject: 'Заказ принят!',
                text: 'Ваш заказ поступил в обработку!'
            });
            return result_order;
        } catch (err) {
            console.log(err);
            console.log('do rollback!');
            await con.query('ROLLBACK');
            con.release();
            throw new Error(err);
        }

    },

    edit: async ({body}) => {
        console.log('body', body);
        const con = await mypool.getCon();
        try {
            con.beginTransaction();
            await updateclient({body: body, con: con})
            const result = await updateorder({body: body, con: con});
            con.commit();
            console.log('Transaction Complete.');
            con.release();
            return result;
            /* End transaction */
        } catch (err) {
            console.log(err);
            console.log('do rollback!');
            await con.query('ROLLBACK');
            con.release();
            throw new Error(err);
        }


    },

    deleteOrder: async ({req}) => {
        const con = await mypool.getCon();
        try {
            console.log("transaction start");
            await con.query('START TRANSACTION');
            console.log("delete order");
            await deleteModel.delete({query: req.query, con: con});
            console.log("get paypal");
            console.log(req.query.paypal_id);
            const result = await createPaypal.get({paypal_id: Number(req.query.paypal_id)});
            console.log(result);
            if (result.state_payment !== 0) {
                //refund
                console.log("do refund");
                const resolve = await createPaypal.refund({paypal_info: result});
                console.log("store refund");
                await refundModel.storeRefund({body: resolve.body, paypal_id: result.paypal_id});
            }
            console.log("delete paypal");
            await deleteModel.delete({query: {id: req.query.paypal_id, route: 'paypal'}, con: con});
            console.log('do commit');
            await con.query('COMMIT');
            con.release();
            console.log('Transaction Complete.');
            /* End transaction */
        } catch (err) {
            await con.query('ROLLBACK');
            con.release();
            throw new Error(err);
        }


    }
};


async function updateclient({body, con}) {
    const sql = 'UPDATE clients SET name = ?, email = ?, idcity = ? WHERE id  = ?';
    await con.query(sql, [
        body.client,
        body.email,
        Number(body.city),
        Number(body.idclient)
    ]);
    return con;
};


async function updateorder({body, con}) {

    var start = new Date(body.datetime);
    var end = new Date(body.datetime);
    end.setHours(end.getHours() + Number(body.size));
    const sql = 'UPDATE orders SET idclient = ?, idcity = ?, idmaster = ?, idproduct = ?, price = ?, start = ?, end = ?  WHERE id  = ?';
    const result = await con.query(sql, [
        Number(body.idclient),
        Number(body.city),
        Number(body.idmaster),
        Number(body.idproduct),
        Number(body.price),
        start,
        end,
        Number(body.id)
    ]);
    return result;
};


async function checkmaster({body}) {
    const con = await mypool.getCon();
    const sql = "SELECT * FROM masters\n"
        + "WHERE masters.name = "
        + mysql.escape(body.master.name) + " AND "
        + "masters.surname = "
        + mysql.escape(body.master.surname) + ' AND '
        + "masters.rating = "
        + mysql.escape(body.master.rating) + ' AND '
        + "masters.idcity = "
        + mysql.escape(body.master.idcity) + " ;";
    const result = await con.query(sql);
    con.release();
    if (result.length === 0) {
        throw new Error('Master not found');
    }
    return result;
};


async function checkmasterisfree({body}) {
    const con = await mypool.getCon();
    var start = new Date(body.datetime);
    var end = new Date(body.datetime);
    end.setHours(end.getHours() + Number(body.size));
    const sql = "SELECT * FROM orders\n"
        + "WHERE idmaster = " + mysql.escape(Number(body.master.id)) + " AND (start <= " + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" + "\n"
        + "OR start <= " + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end)";
    const result = await con.query(sql);
    con.release();
    if (result.length !== 0) {
        throw new Error('Master not found');
    }
    return (result);
};


async function insertorder({body, product, client_id, paypal_id, con}) {
    console.log(typeof product, " product ", product);
    var start = new Date(body.datetime);
    var end = new Date(body.datetime);
    end.setHours(end.getHours() + Number(product.size));
    const sql = "INSERT INTO orders (idclient, price, idproduct, idcity, idmaster, start, end, idpaypal) VALUES (\n"
        + mysql.escape(client_id) + ','
        + mysql.escape(String(product.price)) + ','
        + mysql.escape(Number(product.id)) + ','
        + mysql.escape(Number(body.city)) + ','
        + mysql.escape(Number(body.master.id)) + ','
        + mysql.escape(start) + ','
        + mysql.escape(end) + ','
        + mysql.escape(paypal_id) + ");\n";
    const result = await con.query(sql);
    console.log(result);
    return result;
}


async function insertclient({body, con}) {
    const sql = "INSERT INTO clients (name, email, idcity) VALUES (\n"
        + mysql.escape(body.client) + ', '
        + mysql.escape(body.email) + ', '
        + body.city + ")\n"
        + "ON DUPLICATE KEY UPDATE\n"
        + "name = " + mysql.escape(body.client) + ',\n'
        + "idcity =" + body.city + ";\n";
    const result = await con.query(sql);
    return result;
};


module.exports = order;