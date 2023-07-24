const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const db = require("./config/connection");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
const routes = require("./routes/index");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express(); // Declare app here

// Enable CORS
app.use(cors());

// Create instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const startApolloServer = async () => {
  await server.start();
  // Apply ApolloServer and middleware
  server.applyMiddleware({ app, path: "/graphql" });

  // Apply authentication middleware globally

  app.use(authMiddleware);

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
};

startApolloServer();
