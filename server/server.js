const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const db = require("./config/connection");
const { typeDefs } = require("../server/schemas/typeDefs");
const { resolvers } = require("../server/schemas/resolvers");
const routes = require("./routes");
// will apply globally
const { authMiddleware } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3001;

// Apply authentication middleware globally
app.use(authMiddleware);

// Create instance of ApolloServer
const server = new ApolloServer({
  // graphQL schema
  typeDefs,
  // graphQL resolvers
  resolvers,
});

// apply AS middleware to Express
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.use(routes);

db.once("open", () => {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}/graphql`)
  );
});
