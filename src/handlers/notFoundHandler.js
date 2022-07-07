const fileNotFound = (req, res) => {
  res.statusCode = 404;
  res.end('file not found');
};
exports.fileNotFound = fileNotFound;
