'use strict';
// Create a Users Mongoose model/schema in the auth system

// username: Type: String, Required
// password: Type: String, Required
// email: Type: String
// fullname: Type: String
// role: Type: String, must be one of: admin, editor, writer, user

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    .then(user => user && user.comparePassword(password) )
    .catch(console.error);
};


users.methods.comparePassword = function(plainPassword){
  return bcrypt.compare(plainPassword, this.password)
    .then(valid => valid ? this : null);
};

// Create a method in the schema to generate a Token following a valid login
users.methods.generateToken = function(){

  // let token = await jwt.sign({ username: user.username }, SECRET) (in app.js from DEMO)

};


module.exports = mongoose.model('users', users);