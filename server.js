// CALL THE PACKAGES
var express = require('express'),
    app = express(''),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    User = require('./app/models/user'),
    port = process.env.PORT || 3000;

// APP CONFIGURATION -----------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \Authorization');
  next();
});

// log all requests to the console
app.use(morgan('dev'));

// ROUTES FOR API
// =========================

// basic route for the home page
app.get('/', function(req, res) {
  res.send('Welcome to the home page!');
});

// ROUTES FOR OUR API
//====================
var apiRouter = express.Router();     // get an instance of the express Router

// middleware to use for all requests
apiRouter.use(function(req, res, next) {
  // do logging
  console.log('Somebody just came to our app!');
  next(); // make sure we go to the next routes and don't stop here

})

// route middleware and first route are here

// on routes that end in /users
apiRouter.route('/users')

  // create a user (accessed at POST http://localhost:3000/api/users)
  .post(function(req, res) {

    // create a new instance of the User model
    var user = new User();

    // set the users information (comes from the request)
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    // save the user and check for errors
    user.save(function(err) {
      if(err) {
        // duplicate entry
        if(err.code == 11000)
          return res.json({ success: false, message: 'A user with that username already exists.' });
        else
          return res.send(err);
      }
        res.json({ message: 'User created!' });
    });
  })

// test route to make sure everything is working
// accessed at GET http://localhost:3000/api
apiRouter.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES ------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);



// START SERVER
//=========================
app.listen(port);
console.log('The port is ' + port);
