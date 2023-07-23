const router = require('express').Router();
const { graphqlHTTP } = require('express-graphql');
const { typeDefs, resolvers } = require('../../schemas');

const { authMiddleware } = require('../../utils/auth');


module.exports = router;
