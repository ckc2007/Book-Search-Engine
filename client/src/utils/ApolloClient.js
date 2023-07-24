// import { ApolloClient, InMemoryCache } from "@apollo/client";

// // store context
// const client = new ApolloClient({
//   // set graphQL endpoint to match server route
//   // debug path
//   uri: "/graphql",
//   //   stores and manages the results of graphQL queries on the client-side
//   cache: new InMemoryCache(),
//   headers: {
//     authorization: localStorage.getItem("token") || "",
//   },
// });

// export default client;
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
