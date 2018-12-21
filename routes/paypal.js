const express = require('express');
const router = express.Router();
const paypalModel = require('../models/paypal/paypal');
const webhook = require('../models/paypal/webhook');
const webhookIds = require('../settings/paypal');

router.post('/paypal', (req, res) => {
    console.log('request ++');
    console.log(typeof req.body);
    /*console.log('headers', req.headers);*/
    paypalModel.verify({req: req, webhookId: webhookIds.Payment_sale_completed})
        .then(resolve => {
            var state = resolve;
            console.log(resolve);
            paypalModel.stateChange({body: req.body})
                .then(result => {
                    console.log(result);
                    res.status(200).json({success: true, error: false, data: result.result});
                    return webhook.storeWebhook(req.body, result.order[0], state, req.body.resource.id);
                })

        })
        .catch(err => res.status(501).json({success: false, error: true, data: err}));

});

router.post('/paypal/delete', (req, res) => {
    /*console.log('headers', req.headers);*/
    console.log('paypal refund init');
    console.log(req.body);
    paypalModel.verify({req: req, webhookId: webhookIds.Payment_sale_refund})
        .then(result => {
            var state = result;
            return webhook.get({paypal_id: req.body.resource.sale_id})
                .then(result => {
                    console.log('result/////', result);
                    return webhook.storeWebhook(req.body, {id: result.order_id}, state, req.body.resource.id);
                });

        })
        .then(result => {
            res.status(200).json({success: true, error: false, data: result})
        })
        .catch(err => res.status(501).json({success: false, error: true, data: err}));

});


module.exports = router;