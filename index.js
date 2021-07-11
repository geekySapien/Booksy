require('dotenv').config();
const express = require("express");

const mongoose = require('mongoose');

//const bodyParser=require('body-parser');

//fetching database
const database = require("./Database/database");

//Models

const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Establishing connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log("Connection Established"));





// Initialization
const booky = express();

//Making express use json format
booky.use(express.json());

//booky.use(bodyParser.json())

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameter       None
Methods         GET
*/

booky.get("/", (req, res) => {
    return res.json({ books: database.books });
})

/*
Route           /
Description     Get all books based on isbn
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

booky.get("/i/:isbn", (req, res) => {
    const getSpecified = database.books.filter((book) => {
        return book.ISBN === req.params.isbn;
    })
    if (getSpecified.length === 0) {
        return res.json({ error: `The books with isbn ${req.params.isbn} not found` });
    }
    return res.json({ book: getSpecified });
})

/*
Route           /c
Description     Get all books based on category
Access          PUBLIC
Parameter       category
Methods         GET
*/

booky.get("/c/:category", (req, res) => {
    const getSpecified = database.books.filter((book) => {
        return book.category.includes(req.params.category);
    });
    if (getSpecified.length === 0)
        return res.json({ error: `No book found with category ${req.params.category}` });
    return res.json({ books: getSpecified });
})

/*
Route           /author
Description     Get all authors
Access          PUBLIC
Parameter       none
Methods         GET
*/

booky.get("/author", (req, res) => {
    return res.json({ authors: database.author });
})

/*
Route           /author/books
Description     Get all authors based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

booky.get("/author/books/:isbn", (req, res) => {
    const getSpecified = database.author.filter((auth) => {
        return auth.books.includes(req.params.isbn);
    });
    if (getSpecified.length === 0)
        return res.json({ Error: `No Authors found with book whose isbn is ${req.params.isbn}` });
    return res.json({ Authors: getSpecified });
})

/*
Route           /publications
Description     Get all publications
Access          PUBLIC
Parameter       none 
Methods         GET
*/

booky.get("/publication", ((req, res) => {
    return res.json({ Publication: database.publication });
}))

/*
Route           /book/add
Description     Add new book
Access          PUBLIC
Parameter       none
Methods         POST
*/

booky.post("/book/add", ((req, res) => {
    //console.log(req.body);
    const { addBook } = req.body;
    database.books.push(addBook);
    return res.json({ Books: database.books });
}))

/*
Route           /author/add
Description     Add new author
Access          PUBLIC
Parameter       none
Methods         POST
*/

booky.post("/author/add", ((req, res) => {
    const { addAuthor } = req.body;
    database.author.push(addAuthor);
    return res.json({ Authors: database.author });
}))

/*
Route           /publication/add
Description     Add new publication
Access          PUBLIC
Parameter       none
Methods         POST
*/

booky.post("/publication/add", ((req, res) => {
    const { addPublication } = req.body;
    database.publication.push(addPublication);
    return res.json({ Publications: database.publication });
}))

/*
Route           /update/title
Description     Update book title
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

booky.put("/update/title/:isbn", ((req, res) => {

    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.newTitle;
            return;
        }
    }
    );
    return res.json({ Books: database.books });
}))


/*
Route           /update/author
Description     Update author
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

booky.put('/update/author/:isbn/:authorID', (req, res) => {
    //update book database

    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.author.push(parseInt(req.params.authorID));
            return;
        }

    });

    //update author database

    database.author.forEach((auth) => {
        if (auth.id === parseInt(req.params.authorID)) {
            auth.books.push(req.params.isbn);
            return;
        }
    });
    return res.json({ Books: database.books, Author: database.author });
})


booky.listen(4000, () => console.log("HEy server is running! 😎"));
