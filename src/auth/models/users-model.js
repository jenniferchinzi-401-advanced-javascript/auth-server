'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

const users = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String },
  fullname: { type: String },
  role: { type: String, required: true, default: 'user', enum: ['admin', 'editor', 'writer', 'user'] },
});

// =============================================================================
//Modify user instance BEFORE saving => this.password is now encrypted
users.pre('save', async function() {
  if (this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// =============================================================================
// Create a method in the schema to authenticate a user using the hashed password
users.statics.authenticateBasic = function (username, password){
  let query = { username };
  return this.findOne(query)
    .then(user => user && user.comparePassword(password) );
};

// method used as part of authenticateBasic
users.methods.comparePassword = function(plainPassword){
  return bcrypt.compare(plainPassword, this.password)
    .then(valid => valid ? this : null);
};

// =============================================================================
// Use Oauth to return existing user OR create new user
users.statics.createFromOauth = function(username){

  // Error for missing username
  if(!username){
    return Promise.reject('Validation Error');
  }
  let query = { username };
  return this.findOne(query)
    .then(user => {
      if(!user) { throw new Error('User Not Found');}
      console.log('Welcome Back', user.username);
      return user;
    })
    .catch(error => {
      console.log('Creating New User');
      let password = 'notapermapassword';
      return this.create({ username, password });
    });

};

// =============================================================================
users.methods.generateToken = function () {

  let tokenData = {
    id: this._id,
    role: this.role,
  };
  const signed = jwt.sign(tokenData, process.env.SECRET);
  return signed;
};

// =============================================================================
users.statics.authenticateToken = function (token) {

  try {
    let parsedToken = jwt.verify(token, SECRET);
    console.log('Parsed Token: ', parsedToken);
    return this.findById(parsedToken);
  } catch (error) {
    return Promise.reject;
  }

};

module.exports = mongoose.model('users', users);