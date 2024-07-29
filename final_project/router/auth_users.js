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
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
