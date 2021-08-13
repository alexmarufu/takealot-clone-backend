const jwt = require("jsonwebtoken");

const requireLogin = (req, res, next) => {

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
       return res.status(400).json({ message: "Authorization required" });
    } else if(token) {
        const user = jwt.verify(token, "tokensecret", /*{expiresIn: "1d"}*/);
        req.user = user;
    } else {
        return res.status(400).json({ message: "invalid token" });
    }
    next();
    
  };

  module.exports = requireLogin