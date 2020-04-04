var express = require('express');
var router = express.Router();

const payment = require("./payment")

/* GET home page. */
router.get('/', function(req, res) { res.render('index', { title: 'Express' }) });
router.get("/payment", payment.create3dPayment)


module.exports = router;
