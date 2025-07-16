const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        // Hide error details in production
        const message = process.env.NODE_ENV === "production" ? "Token is not valid!" : err.message;
        return res.status(403).json({ error: message });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ error: "You are not authenticated!" });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: "You are not allowed to do that!" });
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: "You are not allowed to do that!" });
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};
