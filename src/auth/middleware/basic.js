'use strict';

const base64 = require('base-64');

const users = require('../models/users-model.js');

module.exports = (req, res, next) => {

  // req.headers.authorization should be : "Basic encodedusername:sdkjdsljd="

  if (!req.headers.authorization) { next({'message': 'Invalid Authorization Headers', 'status': 401, 'statusMessage': 'Unauthorized'}); return; }

  // Pull out just the encoded part by splitting the header into an array on the space and popping off the 2nd element
  let encodedPair = req.headers.authorization.split(' ').pop();

  // decodes to user:pass and splits it to an array
  let [user, pass] = base64.decode(encodedPair).split(':');

  // Is this user ok?
  return users.authenticateBasic(user, pass)
    .then(validUser => {
      req.token = users.generateToken(validUser);
      req.user = user;
      next();
    })
    .catch(err => next({'message': 'Invalid Authorization Headers', 'status': 401, 'statusMessage': 'Unauthorized'}));

};

