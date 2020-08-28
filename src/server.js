'use strict';

// =============================================================================
// Libraries
const express = require('express');

require('dotenv').config();
const app = express();

const notFound = require('./middleware/404.js');
const serverError = require('./middleware/500.js');

// =============================================================================
// Import Routes

const router = require('./auth/router.js');
const testRouter = require('./auth/extra-routes.js');

// =============================================================================
// Global Middleware

app.use(express.static('./public'));
app.use(express.json());

// =============================================================================
// Custom Routes

app.use(testRouter);
app.use(router);

// =============================================================================
//JS Error Test Route

app.get('/bad', (req, res) => {
  throw new Error('No bueno');
});

//============================================================================

// Error Routes

// 404 Errors
app.use('*', notFound);

// 500 Errors/Failsafe
app.use(serverError);

// =============================================================================
// Export
module.exports = {
  server: app,
  start: port => {
    const PORT = port || process.env.PORT ||3000;
    app.listen(PORT, ()=> console.log(`listening on ${PORT}`));
  },
};