const mysql = require('mysql');
const mypool = require('../settings/MyPool');
const nodemailer = require('nodemailer');
const createPaypal = require('../controllers/paypal/createPaypal');
const webhookModel = require('../controllers/paypal/webhook');
const refundModel = require('../controllers/paypal/refund');
const productModel = require('../controllers/products');
const deleteModel = require('./delete');
const isEmail = require("sane-email-validation");


const Sequelize = require('sequelize');
const db = require('../settings/sequelize');
const Op = Sequelize.Op;
const Cities = require('../models/cities');
const Masters = require('../models/masters');
const Products = require('../models/product');
const Clients = require('../models/clients');
const Paypal = require('../models/paypal');
const Orders = db.define('orders', {
    idclient: {
        type: Sequelize.INTEGER
    },
    price: {
        type: Sequelize.STRING
    },
    idproduct: {
        type: Sequelize.INTEGER
    },
    idcity: {
        type: Sequelize.INTEGER
    },
    idmaster: {
        type: Sequelize.INTEGER
    },
    start: {
        type: Sequelize.DATE
    },
    end: {
        type: Sequelize.DATE
    }
});
Orders.belongsTo(Cities, {foreignKey: 'idcity'});
Orders.belongsTo(Masters, {foreignKey: 'idmaster'});
Orders.belongsTo(Clients, {foreignKey: 'idclient'});
Orders.belongsTo(Products, {foreignKey: 'idproduct'});
Orders.belongsTo(Paypal, {foreignKey: 'idpaypal'});

const order = {

    get: async (order_id) => {
        console.log('get orders init');
        if (order_id === undefined) {
            return await Orders.findAll({
                include: [
                    {model: Cities},
                    {model: Masters},
                    {model: Clients},
                    {model: Paypal},
                    {model: Products}
                ]
            })
        }
        else {
            return await Orders.findAll({
                where: {
                    id: order_id,
                }
            });
        }
    },

    create: async ({body}) => {
        try {
            if (body.client.length < 3) {
                throw new Error('not validation');
            }
            if (!isEmail(body.email)) {
                throw new Error('not validation');
            }
            /* Begin transaction */
            return db.transaction(async (t) => {
                console.log('Begin transaction ');
                console.log('checkmaster');
                await checkmaster({body: body});
                console.log('checkmasterisfree');
                await checkmasterisfree({body: body});
                let client_id;
                let paypal_id;
                let product;
                console.log('insertclient');
                const result_client = await insertclient({body: body});
                client_id = result_client.id;
                console.log('checkproduct');
                product = await productModel.get(body.product);
                console.log('result product', product);
                console.log('createPaypal');
                const result_paypal = await createPaypal.createPaypal();
                paypal_id = result_paypal.id;
                console.log('insertorder', paypal_id);
                const result_order = await insertorder({
                    body: body,
                    product: product,
                    client_id: client_id,
                    paypal_id: paypal_id
                });
                console.log('do commit');
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
            });
        } catch (err) {
            console.log(err);
            console.log('do rollback!');
            throw new Error(err);
        }

    },

    edit: async ({body}) => {
        try {
            let result;
            return db.transaction(async (t) => {
                await updateclient({body: body});
                result = await updateorder({body: body});
                /* End transaction */
                console.log('Transaction Complete.');
                return result;
            });
        } catch (err) {
            console.log(err);
            console.log('do rollback!');
            throw new Error(err);
        }


    },

    deleteOrder: async ({req}) => {
        try {
            return db.transaction(async (t) => {
                console.log("transaction start");
                console.log('delete init');
                await Orders.destroy({where: {id: Number(req.query.id)}});
                console.log("delete order");
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
                createPaypal.delete({query: {id: req.query.paypal_id}});
                console.log('do commit');
                console.log('Transaction Complete.');
                /* End transaction */
            });
        } catch (err) {
            throw new Error(err);
        }
    }
};


async function updateclient({body}) {
    return await Clients.update({
        name: body.client,
        email: body.email,
        idcity: Number(body.city)
    }, {where: {id: Number(body.idclient)}})
};


async function updateorder({body}) {
    let start = new Date(body.datetime);
    let end = new Date(body.datetime);
    end.setHours(end.getHours() + Number(body.size));
    return await Orders.update({
        idclient: Number(body.idclient),
        idcity: Number(body.city),
        idmaster: Number(body.idmaster),
        idproduct: Number(body.idproduct),
        price: Number(body.price),
        start: start,
        end: end
    }, {where: {id: Number(body.id)}})
};


async function checkmaster({body}) {
    let result = await Masters.findAll({
        where: {
            name: body.master.name,
            surname: body.master.surname,
            rating: body.master.rating,
            idcity: body.master.idcity,
        }
    });
    if (result.length === 0) {
        throw new Error('Master not found');
    }
    return result;
};


async function checkmasterisfree({body}) {

    // const con = await mypool.getCon();
    var start = new Date(body.datetime);
    var end = new Date(body.datetime);
    end.setHours(end.getHours() + Number(body.size));
    let result = await Orders.findAll({
        where: {
            idmaster: Number(body.master.id),
            [Op.and]: [
                {
                    [Op.or]: [
                        {
                            start: {
                                [Op.lte]: mysql.escape(start)
                            },
                            end: {
                                [Op.gte]: mysql.escape(start)
                            }
                        }, {
                            start: {
                                [Op.lte]: mysql.escape(end)
                            },
                            end: {
                                [Op.gte]: mysql.escape(end)
                            }
                        }]
                }
            ]
        }
    });
    // const sql = "SELECT * FROM orders\n"
    //     + "WHERE idmaster = " + mysql.escape(Number(body.master.id)) + " AND (start <= " + mysql.escape(start) + " AND " + mysql.escape(start) + " <= end" + "\n"
    //     + "OR start <= " + mysql.escape(end) + " AND " + mysql.escape(end) + " <= end)";
    // const result = await con.query(sql);
    // con.release();
    if (result.length !== 0) {
        console.log('мастерс');
        throw new Error('Master not found');
    }
    return (result);
};


async function insertorder({body, product, client_id, paypal_id}) {
    console.log(typeof product, " product ", product);
    let start = new Date(body.datetime);
    let end = new Date(body.datetime);
    end.setHours(end.getHours() + Number(product.size));
    return await Clients.build({
        idclient: client_id,
        price: String(product.price),
        idproduct: Number(product.id),
        idcity: Number(body.city),
        idmaster: Number(body.master.id),
        start: start,
        end: end,
        idpaypal: paypal_id
    }).save();
}


async function insertclient({body}) {
    return await Clients.build({name: body.client, email: body.email, idcity: body.city}).save();
};


module.exports = order;