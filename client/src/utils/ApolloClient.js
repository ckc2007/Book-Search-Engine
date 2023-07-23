import { ApolloClient, InMemoryCache } from "@apollo/client";

// store context
const client = new ApolloClient({
  // set graphQL endpoint to match server route
  uri: "/graphql",
  //   stores and manages the results of graphQL queries on the client-side
  cache: new InMemoryCache(),
});

export default client;
