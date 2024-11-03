const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json("token required");
  }

  jwt.verify(token, process.env.JWT_SECRET || "shh", (err, decoded) => {
    if (err) {
      return res.status(401).json("token invalid");
    }

    req.decodedToken = decoded;
    next();
  });
};
