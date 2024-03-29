import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

import { getMe, deleteBook } from "../utils/API";
import { authService } from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = authService.loggedIn() ? authService.getToken() : null;

        if (!token) {
          return false;
        }

        const user = await getMe(token);

        if (!user) {
          throw new Error("something went wrong!");
        }

        // debugged response here not an HTTP response object, added user instead from getMe
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = authService.loggedIn() ? authService.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteBook(bookId, token);
  
      // If the deleteBook function does not throw an error,
      // it means the book was deleted successfully.
      // So, update the user data and remove the book's id from localStorage.
      const updatedUser = { ...userData };
      updatedUser.savedBooks = updatedUser.savedBooks.filter(
        (book) => book.bookId !== bookId
      );
      setUserData(updatedUser);
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
      // Handle the error message if needed
      console.log("Error deleting the book:", err.message);
      // ...
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
