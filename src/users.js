'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let secret = process.env.SECRET;
let users = require('./auth/models/users-model');
let db = {};

users.save = async function (record) {

  if (!db[record.username]){
    record.password = await bcrypt.hash(record.password, 10)

    db[record.username] = record;

    return record;
  }

  return Promise.reject();

};
