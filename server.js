var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var Config = {
    user : 'abdullaanasanu',
    database : 'abdullaanasanu',
    host : 'db.imad.hasura-app.io',
    port : 5432,
    password : process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret : "My Web App",
    cookie : {maxAge : 1000 * 60 * 60 * 24 * 30}
}));

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

function createTemplate(data){
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = '<html><head><title>'+title+'</title></head><body><div class="container"><div><a href="/">Home</a></div><hr/><h3>'+heading+'</h3><div>'+date.toDateString()+'</div><div>'+content+'</div></div></body></html>';
    
    return htmlTemplate;
}

function hash(input, salt) {
    
    var hashed = crypto.pbkdf2Sync(input, salt, 11000, 512, 'sha512');
    return ['pbkdf2Sync', '11000', salt, hashed.toString('hex')].join('$');
    
}

app.get('/hash/:input', function(req, res) {
    var hashedString = hash(req.params.input, 'random-wow-haha');
    res.send(hashedString);
});

app.post('/create-user', function(req, res) {
    
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "users" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
        if (err) {
            res.status(500).send(err.toString());
        }else{
            res.send('User successfully created: '+username);
        } 
    });
    
});

app.post('/login', function(req, res) {
    
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * FROM "users" WHERE username = $1', [username], function (err, result) {
        if (err) {
            res.status(500).send(err.toString());
        }else{
            if (result.rows.length ===0){
                res.send(403).send('Username is not found!');
            }else{
                
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassword = hash(password, salt);
                if (hashedPassword === dbString) {
                    req.session.auth = {userId : result.rows[0].id};
                    res.send('Logged In Successfully');
                }else{
                    res.send(403).send('Invalid Password!');
                }
                
            }
        } 
    });
    
});

app.get('/check-login', function(req, res) {
    
    if(req.session && req.session.auth && req.session.auth.userId){
        pool.query('SELECT * FROM "users" WHERE id = $1', [req.session.auth.userId], function(err, result) {
            if (err) {
                res.status(500).send(err.toString());
            }else {
                res.send(result.rows[0].username);
                res.status(200);
            }
        });
    }else{
        res.status(400).send('You are not Logged In');
    }
    
});

app.get('/logout', function(req, res) {
    delete req.session.auth;
    res.send('<html><head><title>Logged Out!</title></head><body><h3>You are successfully Logged Out!</h3><a href="/">Back to Home</a></body></html>');
});

var pool = new Pool(Config);
app.get('/test-db', function (req, res) {
    
    pool.query('SELECT * FROM test', function(err, results) {
        if (err) {
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(results.rows));
        }
    });
});

app.get('/article/:Name', function(req, res) {
    
    pool.query('SELECT * FROM "article" WHERE title = $1', [req.params.Name], function(err, result) {
        if (err){
            res.status(500).send(err.toString());
        }else{
            if (result.rows.length === 0){
                res.status(404).send("Article Not Found!");
            }else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
});