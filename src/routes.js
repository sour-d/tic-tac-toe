const { Router } = require('router');
const { createFileHandler } = require('./handlers/fieHandlers.js');
const { fileNotFound } = require("./handlers/notFoundHandler");

const initiateRouter = (req, res) => {
  const router = new Router(fileNotFound);
  const fileHandler = createFileHandler('./public');

  router.GET('/', (req, res) => {
    req.url.pathname = 'index.html';
    fileHandler(req, res);
  });

  router.handle(req, res);
};

module.exports = { initiateRouter }