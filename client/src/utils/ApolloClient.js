import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/graphql",
});

// DEBUGGGGGGG - needed to add export?
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  // debug the issue here >> not console logging
  console.log("Token from ApolloClient:", token); // Add this line to log the token
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// debug
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
