const express = require('express');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const newUser = { username, password };
  users.push(newUser);

  return res.status(201).json({ message: "User registered successfully" });
});


public_users.get('/', function (req, res) {
  const booksArray = Object.values(books);

  const availableBooks = booksArray.filter(book => book.available !== false);

  if (availableBooks.length === 0) {
    return res.status(404).json({ message: "No books available" });
  }

  return res.status(200).json(availableBooks);
});


public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "Books by this author not found" });
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const booksWithTitle = Object.values(books).filter(book => book.title.toLowerCase() === title);

  if (booksWithTitle.length > 0) {
    return res.status(200).json(booksWithTitle);
  } else {
    return res.status(404).json({ message: "Books with this title not found" });
  }
});


public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    const bookReview = books[isbn].reviews;

    return res.status(200).json({ review: bookReview });
  } else {
    return res.status(404).json({ message: "Review for this book not found" });
  }
});


module.exports.general = public_users;