const jwt = require("jsonwebtoken");

const secret = "mysecretsshhhhh"; // Change this to your actual secret key
const expiration = "2h";

// Function to generate a JWT token
const signToken = (userData) => {
  // Create a payload containing the user data you want to include in the token
  const payload = {
    username: userData.username,
    email: userData.email,
    _id: userData._id,
  };

  // Sign the token with the payload, secret, and expiration time
  const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration });

  return token; // Return the generated token
};

module.exports = signToken;
