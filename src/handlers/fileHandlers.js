const fs = require('fs');
const { fileNotFound } = require('./notFoundHandler');

const createFileHandler = (root) => {
  return (req, res) => {
    const fileName = root + req.url.pathname;

    if (!fs.existsSync(fileName)) {
      fileNotFound(req, res);
      return;
    }
    const fileStream = fs.createReadStream(fileName);
    let data = '';
    res.setHeader('Content-Type', 'text/html')
    fileStream.on('data', (chunk) => data += chunk);
    fileStream.on('close', () => res.end(data));
  }
}

module.exports = { createFileHandler };