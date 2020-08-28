'use strict';

const express = require('express');
const bearerAuthMiddleware = require('./middleware/bearer.js');
const router = express.Router();

router.get('/secret', bearerAuthMiddleware, (req, res) => {
  res.status(200).send('Access Allowed');
});

module.exports = router;