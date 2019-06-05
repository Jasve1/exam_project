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
mongoose.connect(process.env.CONNECTION_STRING, {useNewUrlParser: true});
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
    '/api/users/signUp',
    '/api/jobs',
    '/api/categories',
    '/api/areas'
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
    hash: String,
    jobPostings: [{type: Schema.Types.ObjectId, ref: 'Job'}]
});

const jobSchema = new Schema({
    title: String,
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    area: {type: Schema.Types.ObjectId, ref: 'Area'},
    description: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

const categorySchema = new Schema({
    name: String,
    path_name: String
});

const areaSchema = new Schema({
    name: String,
    path_name: String
});

const User = mongoose.model('User', userSchema);
const Job = mongoose.model('Job', jobSchema);
const Category = mongoose.model('Category', categorySchema);
const Area = mongoose.model('Area', areaSchema);

/****** ROUTES *****/
//USERS
let usersRouter = require('./user_route')(User);
app.use('/api/users', usersRouter);

app.get('/api/user/:id', (req, res) => {
    User.findOne({_id: req.params.id})
    .populate('jobPostings')
    .exec((err, user) => {
        if(err) return console.error(err);
        const userInfo = {
            _id: user._id,
            username: user.username,
            jobPostings: user.jobPostings
        }
        res.json(userInfo);
    })
});

app.put('/api/user/jobPostings/:id', (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if(err) return console.error(err);
        user.jobPostings.push(req.body.jobPostings);
        user.save((err, user) => {
            if(err) return console.error(err);
            console.log(user);
        });
        res.json(user);
    })
})

//JOB POSTINGS
//GET
app.get('/api/jobs', (req, res) => {
    Job.find({})
    .populate('user')
    .populate('category')
    .populate('area')
    .exec((err, jobs) => {
        if(err) return console.error(err);
        res.json(jobs);
    })
})
app.get('/api/categories', (req, res) => {
    Category.find({}, (err, categories) => {
        if(err) return console.error(err);
        res.json(categories);
    })
})
app.get('/api/areas', (req, res) => {
    Area.find({}, (err, areas) => {
        if(err) return console.error(err);
        res.json(areas);
    })
})

//POST
app.post('/api/jobPostings', (req, res) => {
    let newJob = new Job({
        title: req.body.title,
        category: req.body.category,
        area: req.body.area,
        description: req.body.description,
        user: req.body.userId
    });
    newJob.save((err, job) => {
        if(err) return console.error(err);
        console.log(job);
        res.json(job);
    });
})

/**** Reroute all unknown requests to the React index.html ****/
// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../build/index.html'));
//   });

/****** Listen ******/
app.listen(port, () => console.log(`API running on port ${port}!`));