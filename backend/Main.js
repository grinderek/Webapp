const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const favicon = require("serve-favicon");
const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
const Router = require('./Router')

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const db = mysql.createConnection({
    host: 'qz8si2yulh3i7gl3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'u1sosv7ko6tuwyta',
    password: 'm1re4s1e5ogydudm',
    database: 'l4xad57g8hxqizn0'
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
    key: "jdf0pjq0chj4390hf213vh",
    secret: "fja98chjn9nh439n8222sda",
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
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(process.env.PORT || 3000);
