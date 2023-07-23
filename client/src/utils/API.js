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
