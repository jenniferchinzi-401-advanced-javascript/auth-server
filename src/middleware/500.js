// Sends a 500/Server Error message as the response (does not call .next())

'use strict';

function errorHandler (err, req, res, next){
  let error = { error: err };
  res.statusCode = 500;
  res.statusMessage = 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(error) );
  res.end();
}

module.exports = errorHandler;