const jwt = require("jsonwebtoken");

const fetchuser = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "please autheticate using a valid token" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ error: "please autheticate using a valid token" });
  }
};

module.exports = fetchuser;
