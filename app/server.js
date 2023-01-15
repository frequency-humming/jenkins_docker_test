var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
const {Client} = require('pg');

app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


const client = new Client({
    user:'admin',
    host:'host.docker.internal',
    database:'test_db',
    password:'mypassword',
    port:5432,
});

client.connect().then(() => {
    client.query('SELECT NOW()', (err,res) => {
        console.log(res.rows)
    });
}).catch((err) => {
    console.log(err)
});

app.get('/', function(req, res) {
    client.query('SELECT * FROM testing', (err,res) => {
        if(err){
            console.log(err.stack)
        } else {
            console.log(res.rows[0])
        }
    });
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