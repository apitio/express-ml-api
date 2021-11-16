const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');
var userRoutes = require('./routes/user-activity');
var numberPlate = require('./routes/number-plate');
const connection = require('./config/database');
const path = require('path');

const MongoStore = require('connect-mongo')(session);

var cors = require('cors')

require('dotenv').config();

// Create the Express application
var app = express();
// app.use(cors())


// app.use('/static', express.static(path.join(__dirname, 'public')))
// app.use('/static', express.static(path.join(__dirname, 'public')))


// Use below with origin for local testing
// app.use(cors({credentials: true, origin: 'http://localhost:8080'}));


//Use below without local testing
app.use(cors({credentials: true}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));


//Setup Session
const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

//Passport authentication
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next) =>{
    next();
})

app.use((req, res, next) => {
    next();
});


// Imports all of the routes from ./routes/index.js
app.use(routes);
app.use(userRoutes);
app.use(numberPlate);


//Listen on port
app.listen(process.env.PORT ||3000);
