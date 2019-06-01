require('dotenv').config()
const path = require('path');
const express = require('express');
const checkJwt = require('express-jwt');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan'); 
const bcrypt = require('bcrypt'); 

const app = express();
const port = (process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, '../build')));

/****** DATABASE *****/
mongoose.connect(process.env.LOCAL_DB, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DB connected');
});

/****** Configuration *****/
app.use(morgan('combined'));         // Log all requests to the console

if (!process.env.JWT_SECRET) {
    console.error('You need to put a secret in the JWT_SECRET env variable!');
    process.exit(1);
}

/****** MIDDLEWARE *****/
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

    // intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        // respond with 200
        console.log("Allowing OPTIONS");
        res.sendStatus(200);
    } else {
        // move on
        next();
    }
});
//Open paths that does not need login
let openPaths = [
    '/api/users/authenticate',
    '/api/users/signUp'
];
// Validate the user using authentication
app.use(
    checkJwt({ secret: process.env.JWT_SECRET }).unless({ path : openPaths})
);
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: err.message });
    }
});
app.use(bodyParser.json());  


/****** DATABASE SCHEMA *****/
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    hash: String
});

const User = mongoose.model('User', userSchema);

// const users = [
//     { username: "krdo", password: '123'},
//     { username: "tosk", password: 'password'},
//     { username: "mvkh", password: 'l33th0xor'},
// ];

// users.forEach((d) => {
//     bcrypt.hash(d.password, 10, (err, hash) => {
//         let user = new User({
//             username: d.username,
//             hash: hash
//         });
//         user.save((err, user) => {
//             if(err) return console.error(err);
//             console.log(user);
//         });
//     })
// });

/****** ROUTES *****/
//USERS
let usersRouter = require('./user_route')(User);
app.use('/api/users', usersRouter);

app.get('/api/user/:id', (req, res) => {
    User.findOne({_id: req.params.id}, (err, user) => {
        if(err) return console.error(err);
        const userInfo = {
            _id: user._id,
            username: user.username
        }
        res.json(userInfo);
    })
})

/**** Reroute all unknown requests to the React index.html ****/
// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../build/index.html'));
//   });

/****** Listen ******/
app.listen(port, () => console.log(`API running on port ${port}!`));