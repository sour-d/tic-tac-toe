const fs = require('fs');

const fileUploadHandler = (req, res) => {
  const filename = req.body.getHeader('file').filename;
  const fileContent = req.body.get('file');
  fileContent.forEach(content => {
    fs.appendFileSync(filename, content);
  });
  res.end('hey ' + req.body.get('name') + ' you have uploaded ' + filename);
};

module.exports = { fileUploadHandler };