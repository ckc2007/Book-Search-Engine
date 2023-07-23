const { User } = require("../models");
const { signToken } = require("../utils/auth");

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
  Mutation: {
    login: async (parent, { email, password }) => {},
    addUser: async (parent, args) => {},
    saveBook: async (parent, { bookData }, context) => {},
    removeBook: async (parent, { bookId }, context) => {},
  },
};

module.exports = resolvers;
