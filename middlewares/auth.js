const jwt = require("jsonwebtoken");
require("dotenv").config();

// user logs in



let generatedToken = "";
const generateAccessToken = async (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET);
  generatedToken = token;
  return token;
};

// validateUserToken

const validateJwt = async (req, res, next) => {
  // Get the JWT token from the Authorization header.
  const token = req.headers?.authorization?.split(" ")[1];


/*   if (req.headers["content-type"] !== "application/json") {
    res.status(400).send("Invalid content type. Please send JSON data.");
    return;
  }
 */
  // If there is no token, return a 401 Unauthorized error response.
  if (!token) {
    return res.status(401).send({
      message: "No token provided.",
    });
  }

  // Verify the JWT token.
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is valid, pass the request on to the next handler.
    req.user = decodedToken;
    next();
  } catch (error) {
    // If the token is invalid, return a 401 Unauthorized error response.
    return res.status(401).send({
      message: "Invalid token.",
    });
  }
};

const hi = (req, res, next) => {
  console.log("hi");
  next();
};
module.exports = { validateJwt, generateAccessToken };



  