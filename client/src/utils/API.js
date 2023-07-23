import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { GET_ME } from "./graphql/queries";
import {
  LOGIN_USER,
  ADD_USER,
  SAVE_BOOK,
  REMOVE_BOOK,
} from "./graphql/mutations";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

export const getMe = (token) => {
  return client.query({
    query: GET_ME,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (userData) => {
  return client.mutate({
    mutation: ADD_USER,
    variables: userData,
  });
};

export default client;
