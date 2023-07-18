const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // console.log(req.cookies);
    // const token = req.cookies.token;
    const token = req.headers.authorization;
    if (!token) {
      console.log("Must be logged in to view the page");
      res.status(401).json({ status: "false", errMessage: "unauthorized" });
      return;
    }
    const verified = jwt.verify(token, process.env.JWT_SECRETE);
    console.log(verified);
    req.user = verified.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ errMessage: "unauthorized" });
  }
};

module.exports = auth;
