const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;

  if( username && password) {
    if (isValid(username)) {
        users.push({"username": username, "password": password});
        return res.send("User created successfully! Now you can login");
    } else {    
        return res.send("Username already exists.")
    }
  } else {
    return res.send("Username or password not valid");
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  let bookPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve(JSON.stringify(books, null, 4));
    }, 1000);
  });

  const data = await bookPromise;
  res.send(data);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let get_details = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(books[isbn]);
    }, 1000)
  })
    
  let data = await get_details;
  res.send(data);

 });    
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const get_details = new Promise((resolve, reject) => {
    books_result = []
    Object.keys(books).forEach(id => {
      if(books[id].author === req.params.author) {
          books_result.push(books[id])
      }
    });
    resolve(books_result);
  });

  let data = await get_details;
  res.send(data);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  let book_details = new Promise((resolve, reject) => {
    const title = req.params.title;
    let books_result = [];
  
    Object.keys(books).forEach(id => {
      if(books[id].title === title) {
          books_result.push(books[id])
      }
    });

    resolve(books_result);
  })


  let data = await book_details;
  res.send(data);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
