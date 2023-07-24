import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { GET_ME } from "../graphql/queries";
import {
  LOGIN_USER,
  ADD_USER,
  SAVE_BOOK,
  REMOVE_BOOK,
} from "../graphql/mutations";

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

export const loginUser = (userData) => {
  return client.mutate({
    mutation: LOGIN_USER,
    variables: userData,
  });
};

export const saveBook = (bookData, token) => {
  return client.mutate({
    mutation: SAVE_BOOK,
    variables: { bookData },
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const deleteBook = (bookId, token) => {
  return client.mutate({
    mutation: REMOVE_BOOK,
    variables: { bookId },
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};

export default client;
