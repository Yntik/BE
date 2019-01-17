const nodemailer = require('nodemailer');
const createPaypal = require('../controllers/paypal/createPaypal');
const refundModel = require('../controllers/paypal/refund');
const productModel = require('../controllers/products');
const isEmail = require("sane-email-validation");
const Sequelize = require('sequelize');
const db = require('../settings/sequelize');
const Op = Sequelize.Op;
const Cities = require('../models/cities');
const Masters = require('../models/masters');
const Products = require('../models/product');
const Clients = require('../models/clients');
const Paypal = require('../models/paypal');
const Orders = require('../models/orders');
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
                },
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
                const result_client = await insertclient({body: body, t: t});
                client_id = result_client.id;
                console.log('resuult', result_client);
                console.log('checkproduct');
                product = await productModel.get(body.product);
                console.log('result product', product);
                console.log('createPaypal');
                const result_paypal = await createPaypal.createPaypal({t: t});
                paypal_id = result_paypal.id;
                console.log('insertorder', paypal_id);
                const result_order = await insertorder({
                    body: body,
                    product: product,
                    client_id: client_id,
                    paypal_id: paypal_id,
                    t: t
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
            })
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
                await updateclient({body: body, t: t});
                result = await updateorder({body: body, t: t});
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
                await Orders.destroy({where: {id: Number(req.query.id)}, transaction: t});
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
                    await refundModel.storeRefund({body: resolve.body, paypal_id: result.paypal_id, t: t});
                }
                console.log("delete paypal");
                createPaypal.delete({query: {id: req.query.paypal_id}, t: t});
                console.log('do commit');
                console.log('Transaction Complete.');
                /* End transaction */
            });
        } catch (err) {
            throw new Error(err);
        }
    }
};


async function updateclient({body, t}) {
    console.log('body..', body);
    return await Clients.update({
        name: body.client,
        email: body.email,
        idcity: Number(body.city)
    }, {where: {id: Number(body.idclient)}, transaction: t})
};


async function updateorder({body, t}) {
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
    }, {where: {id: Number(body.id)}, transaction: t})
};


async function checkmaster({body}) {
    let result = await Masters.findOne({
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
    const start = new Date(body.datetime);
    let end = new Date(body.datetime);
    end.setHours(end.getHours() + Number(body.size));
    let result = await Orders.findAll({
        where: {
            idmaster: Number(body.master.id),
            [Op.and]:
                {
                    [Op.or]: [
                        {
                            start: {
                                [Op.lte]: start
                            },
                            end: {
                                [Op.gte]: start
                            }
                        }, {
                            start: {
                                [Op.lte]: end
                            },
                            end: {
                                [Op.gte]: end
                            }
                        }]
                }

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
    return result;
};


async function insertorder({body, product, client_id, paypal_id, t}) {
    console.log(typeof product, " product ", product);
    let start = new Date(body.datetime);
    let end = new Date(body.datetime);
    end.setHours(end.getHours() + Number(product.size));
    return await Orders.create({
        price: String(product.price),
        idproduct: Number(product.id),
        idcity: Number(body.city),
        idmaster: Number(body.master.id),
        start: start,
        end: end,
        idpaypal: paypal_id,
        idclient: client_id,
    },{transaction: t});
}


async function insertclient({body, t}) {
    let result = await Clients.findOrCreate({
        where: {email: body.email},
        defaults: {
            name: body.client,
            idcity: body.city
        },
        transaction: t
    });
    console.log('FindOrCreate', result);
    if (result[1]){
        return result[0];
    }
    else {
        Clients.update({name: body.client, email: body.email, idcity: body.city}, {where: {email: body.email}, transaction: t});
        return result[0];
    }
};


module.exports = order;