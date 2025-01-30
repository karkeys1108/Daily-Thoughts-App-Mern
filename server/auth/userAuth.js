const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is not provided",
      });
    }

    try {
      const payload = jwt.verify(token, process.env.SERCETCODE);
      req.user = payload; 
      next(); // Token is valid, proceed to the next middleware
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token invalid",
      });
    }
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while verifying token",
    });
  }
};
