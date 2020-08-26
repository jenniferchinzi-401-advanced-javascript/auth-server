'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String },
  fullname: { type: String },
  role: { type: String, required: true, default: 'user', enum: ['admin', 'editor', 'writer', 'user'] },
});

//Modify user instance BEFORE saving => this.password is now encrypted
users.pre('save', async function() {
  if (this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Create a method in the schema to authenticate a user using the hashed password
users.statics.authenticateBasic = function (username, password){
  let query = { username };
  return this.findOne(query)
    .then(user => user && user.comparePassword(password) );
  // .catch(console.error);
};

// method used as part of authenticateBasic
users.methods.comparePassword = function(plainPassword){
  return bcrypt.compare(plainPassword, this.password)
    .then(valid => valid ? this : null);
};

// Create a method in the schema to generate a Token following a valid login
users.methods.generateToken = function(){

  let tokenData = {
    id: this._id,
    role: this.role,
  };

  const signed = jwt.sign(tokenData, process.env.SECRET);
  return signed;

};

// Use Oauth to return existing user OR create new user
users.statics.createFromOauth = async function(email){

  // Async Error for missing email
  if(!email){
    return Promise.reject('Validation Error');
  }

  let query = { email };
  const user = await this.findOne(query);

  if (user){
    return user;
  } else {
    return this.create ({ username: email, password: 'none', email: email });
  }

};

module.exports = mongoose.model('users', users);