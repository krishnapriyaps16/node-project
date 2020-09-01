var express = require('express')

const jwt = require('jsonwebtoken');
var mysql = require('mysql');

//var session = require('express-session');
var bodyParser = require('body-parser');
var connection = require('./config');

var cors = require('cors');



var app = express()

app.get('/', (request, response) => {
    response.send('Server OKay at 3000')
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('uploads/thumpnail'));
app.use(express.static('uploads/attachment'));
app.use(express.static('searchResults'));
app.use(express.static(__dirname + '/uploads/thumpnail'));
app.use(express.static(__dirname + '/uploads/attachment'));
app.use(express.static(__dirname + '/searchResults'));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

const loginRoutes = require('./routes/user');
const packageRoutes = require('./routes/package');
const masterRoutes = require('./routes/masters');
const subsearchRoutes = require('./routes/subscriber');
const dashboardRoutes = require('./routes/dashboard');
const agentprofileRoutes = require('./routes/agentprofile');
const notificationRoutes = require('./routes/notification');
const agentprofileeditRoutes = require('./routes/agentprofileedit');
const paymentRoutes = require('./routes/payment');
const searchResultRoutes = require('./routes/searchresult');
app.use("/user", loginRoutes);
app.use("/packages", packageRoutes);
app.use("/masters", masterRoutes);
app.use("/subscribers", subsearchRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/profile", agentprofileRoutes);
app.use("/agent", agentprofileeditRoutes);
app.use("/notification", notificationRoutes);
app.use("/payment", paymentRoutes);
app.use("/searchresult", searchResultRoutes);
app.listen(3000)
console.log('Server listening at port 3000');