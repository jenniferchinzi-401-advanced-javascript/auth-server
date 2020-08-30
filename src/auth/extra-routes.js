'use strict';

const express = require('express');
const bearerAuthMiddleware = require('./middleware/bearer.js');
const permissions = require('./middleware/acl.js');
const router = express.Router();

router.get('/public', routeHandler);
router.get('/private', bearerAuthMiddleware, routeHandler);
router.get('/readonly', bearerAuthMiddleware, permissions('read'), routeHandler);
router.post('/create', bearerAuthMiddleware, permissions('create'), routeHandler);
router.put('/update', bearerAuthMiddleware, permissions('update'), routeHandler);
router.delete('/delete', bearerAuthMiddleware, permissions('delete'), routeHandler);

function routeHandler(req, res) {
  res.status(200).send('Access Granted');
}

module.exports = router;