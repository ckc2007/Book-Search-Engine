import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import ApolloClient from "./utils/ApolloClient";

console.log(localStorage.getItem("token")); // Log the token

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={ApolloClient}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
