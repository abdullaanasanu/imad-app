var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pq').Pool;

var Config = {
    user : 'abdullaanasanu',
    database : 'abdullaanasanu',
    host : 'db.imad.hasura-app.io',
    port : 5432,
    password : process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

var counter = 0;
app.get('/counter', function (req, res) {
    counter = counter + 1;
    res.send(counter.toString());
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});

var names = [];
app.get('/submit-name', function (req, res) {
    var name = req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
});

var pool = new Pool(Config);
app.get('/test-db', function (req, res) {
    
    pool.query('SELECT * FROM test', function(err, results) {
        if (err) {
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result));
        }
    });
});