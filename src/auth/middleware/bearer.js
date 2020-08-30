'use strict';

const User = require('../models/users-model.js');


module.exports = async (req, res, next) => {

  if (!req.headers.authorization){ next('Invalid Login: Missing Authorization'); return; }

  // Pull out encoded section of the authorization value
  let token = req.headers.authorization.split(' ').pop();

  try {
    const validUser = await User.authenticateToken(token);

    req.user = validUser;

    req.user = {
      username: validUser.username,
      fullname: validUser.fullname,
      email: validUser.email,
      capabilities: validUser.capabilities,
    };

    next();

  } catch (error) {

    next('Invalid Login');

  }
  
};
  
// Promise Version
// User.authenticateToken(token)
//   .then (validUser => {
//     req.user = validUser;
//     next();
//   })//catch errors from the user model
//   .catch(err => next('Invalid Login'));