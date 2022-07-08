const registrationHandler = (req, res) => {
  const name = req.body.get('name');
  res.setHeader('set-cookie', 'name=' + name + '; Max-age=60');
  const responseBody = { registered: true };
  res.end(JSON.stringify(responseBody));
};

module.exports = { registrationHandler };