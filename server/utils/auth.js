const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");

const secret = "mysecretsshhhhh";
const expiration = "2h";

const authMiddleware = (req, res, next) => {
  let token = req.headers.authorization || "";

  if (!token) {
    throw new AuthenticationError("You have no token!");
  }

  // Extract the token value from the "Bearer <token>" format
  token = token.replace("Bearer ", "");

  try {
    // verify token and get user data out of it
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
    next();
  } catch (err) {
    console.error(err);
    throw new AuthenticationError("Invalid token!");
  }
};

const signToken = ({ username, email, _id }) => {
  const payload = { username, email, _id };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = { authMiddleware, signToken };
