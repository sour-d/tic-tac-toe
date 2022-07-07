const { server } = require('server');
const { Router } = require('router');

// const {
//   fileHandler
// } = require('./handlers/fileHandlers.js');

const fileNotFound = (req, res) => {
  res.statusCode = 404;
  res.end('file not found');
}

const onReq = (req, res) => {
  // const handlers = [fileHandler];
  const router = new Router(fileNotFound);
  router.handle(req, res);
}

server(onReq);