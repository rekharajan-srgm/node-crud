const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  // const authHeader = req.header("users-token");
  const authHeader = req.header("authorization");
 
console.log(authHeader);  
  const bearerToken=authHeader.split(' ');
  const token=bearerToken[1];
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
