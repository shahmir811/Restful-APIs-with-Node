const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // get token. Token came in header like Bearer token
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = req.headers.authorization.split(' ')[1];

  // if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
