// const jwt = require("jsonwebtoken");
// const signToken = require("./signToken");
// const { AuthenticationError } = require("apollo-server-express");

// const secret = "mysecretsshhhhh"; // Change this to your actual secret key
// const expiration = "2h";

// const authMiddleware = (req, res, next) => {
//   // allows token to be sent via req.query or headers
//   let token = req.query.token || req.headers.authorization;

//   if (!token) {
//     throw new AuthenticationError("You have no token!");
//   }

//   if (req.headers.authorization) {
//     token = token.split(" ").pop().trim();
//   }

//   try {
//     // verify token and get user data out of it
//     const { data } = jwt.verify(token, secret, { maxAge: expiration });
//     req.user = data; // Attach the user data to req.user
//     console.log("Decoded user data:", req.user); // Log the decoded user data
//     // Generate a new token and include it in the response header
//     const newToken = signToken(req.user);
//     res.set("Authorization", `Bearer ${newToken}`);
//     next(); // Call the next middleware
//   } catch (err) {
//     console.error(err);
//     throw new AuthenticationError("Invalid token!");
//   }
// };

// module.exports = authMiddleware;
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

const authMiddleware = (req, res, next) => {
  let token = req.headers.authorization || '';

  if (!token) {
    throw new AuthenticationError('You have no token!');
  }

  // Extract the token value from the "Bearer <token>" format
  token = token.replace('Bearer ', '');

  try {
    // verify token and get user data out of it
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
    next();
  } catch (err) {
    console.error(err);
    throw new AuthenticationError('Invalid token!');
  }
};

const signToken = ({ username, email, _id }) => {
  const payload = { username, email, _id };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = { authMiddleware, signToken };
