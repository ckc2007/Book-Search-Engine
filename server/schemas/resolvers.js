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
      const user = await User.create({ username, email, password });

      if (!user) {
        throw new AuthenticationError("Couldn't create user");
      }

      const token = signToken(user);
      return { token, user };
    },
    // context.user holds the logged-in user's data
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: bookData } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }

      throw new AuthenticationError("Please login in to save a book");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }

      throw new AuthenticationError(
        "Please login to remove a book from your saved books"
      );
    },
  },
};

module.exports = resolvers;
