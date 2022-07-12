const { server } = require('server');
const { parseBody } = require('./handlers/parser.js');
const { injectCookies } = require('./injecetCookies.js');
const { initiateRouter } = require('./routes.js');
const { Sessions, injectSession } = require('./session.js');

const logRequestDetails = (req) => {
  console.log(`[${req.method}] ==> ${req.url.pathname}`);
};

const getHostName = (req) => 'http://' + req.headers.host;

const sessions = new Sessions();

const processRequest = (req, res) => {
  req.url = new URL(req.url, getHostName(req));
  let data = [];
  req.on('data', (chunk) => data.push(chunk));
  req.on('end', () => {
    if (data.length) {
      const body = Buffer.concat(data);
      parseBody(body, req);
    }
    injectCookies(req, res);
    injectSession(req, res, sessions);
    logRequestDetails(req);
    initiateRouter(req, res, sessions);
  });
};

server(processRequest);