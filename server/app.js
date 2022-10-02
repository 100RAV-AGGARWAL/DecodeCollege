var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const config = require("config");
const cron = require('node-cron');
const passport = require('passport');
const swaggerUI = require('swagger-ui-express');
const YAML = require("yamljs")
const swaggerJsDoc = YAML.load('./swagger/swagger.yaml');
const bodyParser = require('body-parser');
const assignmentController = require('./controllers/assignment.controller');
const { google } = require('googleapis');

var indexRouter = require('./routes/index');
var app = express();
var testCronJob = config.get('cronjob').testing;

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	next();
});

app.use(express.static(path.join(__dirname, 'public')));

//Cron Job to send Mail for Due Assignment
cron.schedule(testCronJob, assignmentController.assignmentListByDateRange); //Fire After Every Minute

app.use('/api', indexRouter);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
