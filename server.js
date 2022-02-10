var express = require('express')


var mysql = require('mysql');

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



const packageRoutes = require('./routes/package');
app.use("/packages", packageRoutes);

app.listen(8000)
console.log('Server listening at port 8000');