'use strict';

const base64 = require('base-64');

const User = require('../models/users-model.js');

module.exports = (req, res, next) => {
  const errorObj = {'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'};
  // req.headers.authorization should be : "Basic encodedusername:sdkjdsljd="

  if (!req.headers.authorization) { next(errorObj); return; }

  // Remove 'Basic ' by splitting on the space
  let encodedPair = req.headers.authorization.split(' ').pop();

  // Decode to user:pass and splits it to an array
  let [user, pass] = base64.decode(encodedPair).split(':');

  // Is this user ok?
  return User.authenticateBasic(user, pass)
    .then(validUser => {
      req.token = validUser.generateToken(validUser);
      req.user = user;
      next();
    })
    .catch(err => next(errorObj));

  // Async Version for Reference -> Requires 'async' function declaration
  // try{
  //   const validUser = await User.authenticateBasic(user, pass);
  //   req.token = validUser.generateToken();
  //   next();

  // } catch(err) {
  //   next(errorObj);
  // }

};

