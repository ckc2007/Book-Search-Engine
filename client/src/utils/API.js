// import { ApolloClient, InMemoryCache } from "@apollo/client";
// import { authService } from "./auth";
import client from "./ApolloClient";
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

export const getMe = async (token) => {
  try {
    const response = await client.query({
      query: GET_ME,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response || !response.data || !response.data.me) {
      throw new Error("Invalid response or missing data.");
    }

    return response.data.me;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching user data.");
  }
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

// API.js
export const saveBook = async (bookData, token) => {
  try {
    const response = await client.mutate({
      mutation: SAVE_BOOK,
      variables: { bookData },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response || !response.data || !response.data.saveBook) {
      throw new Error("Invalid response or missing data.");
    }

    return response.data.saveBook;
  } catch (err) {
    console.error(err);
    throw new Error("Error saving the book.");
  }
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
