const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");
const regd_users = express.Router();
 
let users = [];

 const SECRET_KEY = "8b393e59f8dfe0ffca1009eb8c450d4b428ece6082237a2855b4a67f223b7f687373fee8d022f5e9f7c570e39815ce7815cbd9039ee54970828414107a020711";

 const isValid = (username) => {
  return username && !users.some((user) => user.username === username);
};

 const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username);
  return user && user.password === password;
};

 regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

   const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  return res.status(200).json({ message: "Login successful", token });
});

regd_users.put("/review/:isbn", (req, res) => {
  const isbn = String(req.params.isbn);
  const { review } = req.body;
  const authHeader = req.headers.authorization;

  console.log(`Received request for ISBN: ${isbn}`);
  console.log(`Authorization Header: ${authHeader}`);

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = decoded.username;

    console.log(`Decoded username: ${username}`);

    if (!books[isbn]) {
      console.log("Book not found");
      return res.status(404).json({ message: "Book not found" });
    }

    if (!review || typeof review !== "string") {
      return res.status(400).json({ message: "Review must be a non-empty string" });
    }

    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    console.log(`Updated reviews for ${isbn}:`, books[isbn].reviews);

    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });

  } catch (error) {
    console.log("JWT Error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
