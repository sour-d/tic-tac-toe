const parseCookie = (cookieString) => {
  const cookies = cookieString.split(';');
  const parsedCookies = {};

  cookies.forEach(cookie => {
    const [key, value] = cookie.split('=');
    parsedCookies[key.trim()] = value.trim();
  });

  return parsedCookies;
};

const injectCookies = (req, res) => {
  const cookieString = req.headers.cookie;
  req.cookies = cookieString ? parseCookie(cookieString) : {};
};

module.exports = { injectCookies };
