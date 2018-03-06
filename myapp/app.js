require('dotenv').config();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var app = express();

//const keyPublishable = process.env.PUBLISHABLE_KEY;
//const keySecret = process.env.SECRET_KEY;

//Stripe用　Key宣言
const keyPublishable = process.env.PUBLISHABLE_KEY2;
const keySecret = process.env.SECRET_KEY2;
const stripe = require("stripe")(keySecret);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.get("/", (req, res) =>res.render("index.jade", {keyPublishable}));
app.get("/invoice", (req, res) =>res.render("invoice.jade", {keyPublishable}));
app.get("/charge", (req, res) =>res.render("charge.jade"));
app.get("/management", (req, res) => res.render("management.jade"));

app.get("/login", (req, res) =>res.render("login.jade"));
app.get("/mypage", (req, res) => res.render("mypage.jade"));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require("body-parser").urlencoded({extended: false}));

app.use('/users', users);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Stripe チャージ(一括)
app.post("/charge", (req, res) => {
  let amount = 500;
  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: "usd",
         customer: customer.id
    }))
  .then(charge => res.render("charge.jade"));
});

stripe.invoiceItems.create({
  amount: 1000,
  currency: 'usd',
  customer: 'cus_4fdAW5ftNQow1a',
  description: 'One-time setup fee',
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
