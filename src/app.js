const { server } = require('server');
const { injectCookies } = require('./injecetCookies.js');
const { initiateRouter } = require('./routes.js');
const { Sessions, injectSession } = require('./session.js');

const logRequestDetails = (req) => {
  console.log(`[${req.method}] ==> ${req.url.pathname}`);
};

const getHostName = (req) => 'http://' + req.headers.host;

const parseBody = (data, req) => {
  req.body = new URLSearchParams(data);
};

const sessions = new Sessions();

const processRequest = (req, res) => {
  req.url = new URL(req.url, getHostName(req));
  let data = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => data += chunk);
  req.on('close', () => {
    parseBody(data, req);
    injectCookies(req, res);
    injectSession(req, res, sessions);
    logRequestDetails(req);
    initiateRouter(req, res, sessions);
  });
};

server(processRequest);