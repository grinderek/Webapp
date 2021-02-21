const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
const Router = require('./Router')

app.use(express.static('public'));
app.use(express.json());

const db = mysql.createConnection({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'bd37c1454987a6',
    password: '8db9f6afe87e2b0',
    database: 'heroku_d996ea8e71531df'
});

db.connect(function(err){
    if(err) {
        console.log('DB err');
        throw err;
        return false;
    }
});

const sessionStore = new MySqlStore({
    expiration: (1825 * 86400 * 1000),
    endConnectionOnClose: false
}, db);

app.use(session({
    key: "jdf0pjq0chj4390hf213vhc07h3421s0129s219hs",
    secret: "fja98chjn9nh439n822291nhd89ch913123hcv348",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false
    }
}));

new Router(app, db);

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.port || 3000);