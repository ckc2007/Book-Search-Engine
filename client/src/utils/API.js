import { ApolloClient, InMemoryCache } from "@apollo/client";
// import { authService } from "./auth";
import client, { authLink } from "./ApolloClient";
import { GET_ME } from "../graphql/queries";
import {
  LOGIN_USER,
  ADD_USER,
  SAVE_BOOK,
  REMOVE_BOOK,
} from "../graphql/mutations";

// debug
// const client = new ApolloClient({
//   link: authLink,
//   uri: "/graphql",
//   cache: new InMemoryCache(),
// });

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
  console.log("Token from client API:", token); // Add this line to log the token
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
