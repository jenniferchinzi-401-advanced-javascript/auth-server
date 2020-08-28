'use strict';

const User = require('../models/users-model.js');


module.exports = async (req, res, next) => {

  if (!req.headers.authorization){ next('Invalid Login: Missing Authorization'); return; }

  // Pull out encoded section of the authorization value
  let token = req.headers.authorization.split(' ').pop();
  User.authenticateToken(token)
    .then (validUser => {
      req.user = validUser;
      next();
    })//catch errors from the user model
    .catch(err => next('Invalid Login'));

};