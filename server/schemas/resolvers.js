const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    //   query that can be made by the client to retrieve information about the currently authenticated user.
    me: async (parent, args, context) => {
      // Resolvers in Apollo Server receive four arguments: parent, args, context, and info
      // check if the user is authenticated
      if (context.user) {
        const userData =
          await // If the user is authenticated, proceed to find the user in the db
          (
            await User.findOne({ _id: context.user._id })
          )
            //    exclude the __v and password fields from the returned user data
            .select("-__v -password");
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  //   write operations
  Mutation: {
    //   authenticate the user based on the provided credentials (email and password)
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError("Invalid credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    // args is registration data provided by client (username, email, password)
    // create a new user and return Auth object that contains a token and user data
    addUser: async (parent, { username, email, password }) => {
      try {
        // Attempt to create a new user
        const user = await User.create({ username, email, password });

        if (!user) {
          // If user creation fails, throw an error
          throw new Error("Couldn't create user");
        }

        // If user creation is successful, sign a token for the new user
        const token = signToken(user);

        // Return the token and user data in the response
        return {
          token,
          _id: user._id,
          username: user.username,
          email: user.email,
        };
      } catch (err) {
        // If there's an error during user creation or token signing, log the error
        console.error(err);

        // Throw an authentication error to be handled by Apollo Server
        throw new AuthenticationError("Failed to create user");
      }
    },
    // context.user holds the logged-in user's data
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        if (!bookData) {
          throw new Error("Book data is required");
        }

        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: bookData } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }

      throw new AuthenticationError("Please log in to save a book");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        if (!bookId) {
          throw new Error("Book ID is required");
        }

        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }

      throw new AuthenticationError(
        "Please log in to remove a book from your saved books"
      );
    },
  },
};

module.exports = resolvers;
