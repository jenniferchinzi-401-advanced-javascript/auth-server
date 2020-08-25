'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const server = require('./src/server.js');

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

// Connect to Mongo Database
mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

server.start(process.env.PORT);
