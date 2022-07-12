const { Router } = require('router');
const { createFileHandler } = require('./handlers/fileHandlers.js');
const { fileNotFound } = require("./handlers/notFoundHandler");
const { fileUploadHandler } = require('./handlers/fileUploadHandler.js');

const initiateRouter = (req, res, sessions) => {
  const fileHandler = createFileHandler('./public');
  const router = new Router(fileHandler);

  router.GET('/', (req, res) => {
    req.url.pathname = 'index.html';
    fileHandler(req, res);
  });

  router.POST('/upload', fileUploadHandler);

  router.handle(req, res, sessions);
};

module.exports = { initiateRouter }