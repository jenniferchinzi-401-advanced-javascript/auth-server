'use strict';

const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const base4 = require('base-64');
const jwt = require('jsonwebtoken');


//    Uses middleware (BasicAuthentication) to validate the user
const basicAuth = require('./middleware/basic.js');

let users = require('../users.js');
let secret = process.env.SECRET;


// Create a POST route for /signup
//    Accepts either a JSON object or FORM Data with the keys “username” and “password”
router.post('signup', async (req, res, next) => {
  let user = req.body;
  //    Creates a new user record in a Mongo database
  if(!users[user.username]){

    // hash password and save it to the user
    user.password = await bcrypt.hash(req.body.password, 10)
    
    // create a new user
    user[user.username] = user;

    // create a signed "token"
    let token = await jwt.sign({ username: user.username }, secret)

    // send the "token"
    res.status(200).send(token);
  }
  else {
    res.status(403).send('Username is Unavailable');
  }

});

// Create a POST route for /signin
//    router.post('/signin', basicAuth, (req,res) => {});
router.post('signin', basicAuth, (req, res, next) => {


  // Additionally, set a Cookie and a Token header on the response, with the token as the value
  res.cookie('auth', req.token);
  //    When validated, send a JSON object as the response with the following properties:
  //       token: The token generated by the users model
  //       user: The users’ database record
  res.send({
    token: req.token,
    user: req.user,
  });

});


// Create a GET route for /users that returns a JSON object with all users

router.get('users', (req, res) => {
  res.status(200).json(users);
});

// Stretch Goal: have this route also use the middleware for authentication so that you cannot see the user list without a valid username and password

module.exports = router;