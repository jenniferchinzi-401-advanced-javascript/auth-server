// Sends a 404/Not-Found message as the response (does not call .next())

'use strict';

function notFound(req, res, next){
  let error = { error: 'Resource Not Found' };
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
}

module.exports = notFound;