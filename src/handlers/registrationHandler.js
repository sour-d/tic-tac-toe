const registrationHandler = (req, res, session) => {
  const name = req.body.get('name');
  const sessionId = session.create({ name });

  res.setHeader('set-cookie', 'sessionId=' + sessionId + '; Max-age=60');
  const responseBody = { registered: true };
  res.end(JSON.stringify(responseBody));
};

module.exports = { registrationHandler };