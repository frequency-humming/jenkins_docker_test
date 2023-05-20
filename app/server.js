var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
const {Pool} = require('pg');

app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

const db = async () => {
    try {
        const pool = new Pool ({
            user:'admin',
            host:'host.docker.internal',
            database:'test_db',
            password:'mypassword',
            port:5432,
        });
        await pool.connect();
        const res = await pool.query('SELECT * FROM testing');
        console.log(res);
        await pool.end();
    } catch (error){
        console.log(error);
    }
}

app.get('/', function(req, res){
    console.log('in the method');
    db();
    if ("counter" in req.session) {
        req.session["counter"] += 1;           
    } else {
        req.session["counter"] = 0;
    }
    
    res.render("index", { counter: req.session.counter});
})

app.get('/one', function(req, res) {

    req.session["counter"] += 1;
    
    res.redirect("/");
})

app.get('/reset', function(req, res) {

    req.session["counter"] = 0;
    
    res.redirect("/");
})



app.listen(8000, function() {
    console.log("listening on port 8000");
});