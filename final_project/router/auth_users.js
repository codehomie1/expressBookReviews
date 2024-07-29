const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let search = users.filter(user => user.username === username);

    if ( search.length > 0 ) {
        return false; // user already exists
    }

    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let search = users.filter(user => user.username == username && user.password == password);
    if ( search.length > 0 ) {
        return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if(!username || !password) {
    return res.send("Error logging in. Please check username or password.").status(404)
  }

  if(authenticatedUser(username, password)) {
    // create session key with specific time
    let accessToken = jwt.sign({
        data: password,
    }, 'access', {expiresIn: 60*60 });

    // store in session
   req.session.authorization = {
    accessToken,
    username
   }
   return res.send("User successfully logged in.").status(200)
  } else {
    return res.send("Invalid Login. Check username or password.").status(208)
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  const isbn = req.params.isbn;

  // find isbn
  if(books[isbn]) {
    // if user already made review modify it else add it
     const username = req.session.authorization.username;
     books[isbn].reviews[username] = review
     return res.send(`The review for book with ISBN ${isbn} has been added/updated.`).status(201);
    } else {
      return res.send("Book with isbn " + isbn + " not found.").status(404);
    }
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if(books[isbn]) {
        delete books[isbn].reviews[username];
        return res.send("Review for book with ISBN " + isbn + " deleted.");
    } else {
        return res.status(404).send("Book with ISBN " + isbn + " not found.");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
