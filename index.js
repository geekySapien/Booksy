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

/*booky.get("/", (req, res) => {
    return res.json({ books: database.books });
})*/

booky.get("/", async(req, res) => {
    const getAllBooks=await BookModel.find();
    return res.json({ books: getAllBooks });
})

/*
Route           /
Description     Get all books based on isbn
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

/*booky.get("/i/:isbn", (req, res) => {
    const getSpecified = database.books.filter((book) => {
        return book.ISBN === req.params.isbn;
    })
    if (getSpecified.length === 0) {
        return res.json({ error: `The books with isbn ${req.params.isbn} not found` });
    }
    return res.json({ book: getSpecified });
})*/

booky.get("/i/:isbn", async (req, res) => {
    const getSpecified = await BookModel.findOne({ISBN: req.params.isbn});
    if (!getSpecified ) {
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

/*booky.get("/c/:category", (req, res) => {
    const getSpecified = database.books.filter((book) => {
        return book.category.includes(req.params.category);
    });
    if (getSpecified.length === 0)
        return res.json({ error: `No book found with category ${req.params.category}` });
    return res.json({ books: getSpecified });
})*/

booky.get("/c/:category", async (req, res) => {
    const getSpecified = await BookModel.findOne({category: req.params.category})
    if (!getSpecified)
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

/*booky.get("/author", (req, res) => {
    return res.json({ authors: database.author });
})*/

booky.get("/author", async(req, res) => {
    const getAuthors=await AuthorModel.find();
    return res.json({ authors: getAuthors });
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

/*booky.post("/book/add", ((req, res) => {
    //console.log(req.body);
    const { addBook } = req.body;
    database.books.push(addBook);
    return res.json({ Books: database.books });
}))*/


booky.post("/book/add", ((req, res) => {
    //console.log(req.body);
    const { addBook } = req.body;
    BookModel.create(addBook);
    return res.json({ Books: addBook, message:"Book was added" });
}))
/*
Route           /author/add
Description     Add new author
Access          PUBLIC
Parameter       none
Methods         POST
*/

/*booky.post("/author/add", ((req, res) => {
    const { addAuthor } = req.body;
    database.author.push(addAuthor);
    return res.json({ Authors: database.author });
}))*/

booky.post("/author/add", ((req, res) => {
    const { addAuthor } = req.body;
    AuthorModel.create(addAuthor);
    return res.json({ message:"Author was added" });
}))

/*
Route           /publication/add
Description     Add new publication
Access          PUBLIC
Parameter       none
Methods         POST
*/

/*booky.post("/publication/add", ((req, res) => {
    const { addPublication } = req.body;
    database.publication.push(addPublication);
    return res.json({ Publications: database.publication });
}))*/

booky.post("/publication/add", ((req, res) => {
    const { addPublication } = req.body;
    PublicationModel.create(addPublication);
    return res.json({ message:"Publication was added" });
}))

/*
Route           /update/title
Description     Update book title
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

/*booky.put("/update/title/:isbn", ((req, res) => {

    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.newTitle;
            return;
        }
    }
    );
    return res.json({ Books: database.books });
}))*/

booky.put('/update/title/:isbn',async(req, res)=>{
    const updatedBook=await BookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn
        },
        {
            title : req.body.bookTitle
        },
        {
            new:true
        });
        console.log(updatedBook);
    return res.json({Book:updatedBook});
})


/*
Route           /update/author
Description     Update author
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

/*booky.put('/update/author/:isbn/:authorID', (req, res) => {
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
})*/

booky.put('/update/author/:isbn/:authorID', async(req, res)=>{
    const updatedBook=await BookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn
        },
        {
            $push: {
                authors: parseInt(req.params.authorID)
            }
        },
        {
            new: true
        }
 );

    const updatedAuthor=await AuthorModel.findOneAndUpdate(
        {
           id:  parseInt(req.params.authorID)
        },
        {
            $addToSet:{
                books: req.params.isbn
            }
        },
        {
            new:true
        }
    )

    return res.json({books:updatedBook, authors: updatedAuthor, message:"Succesfully added a author to book"});
})


/*
Route           /update/publication
Description     Update/add new book to a publication
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

booky.put('/update/publication/:isbn/:pubId', ((req, res) => {
    //Updating book Database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publications = parseInt(req.params.pubId);
            return;
        }
    });

    //Updating Publication Database

    database.publication.forEach((pub) => {
        if (pub.id === parseInt(req.params.pubId)) {
            pub.books.push(req.params.isbn);
            return;
        }
    });

    return res.json({ books: database.books, publications: database.publication, message: "Succesfully updated data" });
}))


/*
Route           /book/delete
Description     Delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELETE
*/

/*booky.delete('/book/delete/:isbn', (req,res)=>{
    //We are not using forEach loop here because here we wwant to delete a specfiedd book i.e filter book that has isbn equal to that received from the parameter. So it would be ideal to use filter method here

    const updatedBookDatabase=database.books.filter((book)=>{
        return book.ISBN!==req.params.isbn;
    })

    //filter will return new array, so store it in the master object
    database.books=updatedBookDatabase;
    return res.json({books: database.books});
})*/

booky.delete('/book/delete/:isbn', async(req, res)=>{
    const updatedBookDatabase=await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    )
    return res.json({message: "Book was successfullly deleted"});
})

/*
Route           /book/delete/author
Description     Delete an author from book
Access          PUBLIC
Parameter       isbn, author id
Methods         DELETE
*/

/*booky.delete('/book/delete/author/:isbn/:authorId', ((req, res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn)
        {
            const newAuthorList=book.author.filter((auth)=>{
              auth!==parseInt(req.params.authorId);
            });
            book.author=newAuthorList;
            return;
        }
    })

    database.author.forEach((auth)=>{
        if(auth.id===parseInt(req.params.authorId))
        {
            const newBookList=auth.books.filter((book)=>{
                book!== req.params.isbn;     
        });
        auth.books=newBookList;
    }})

    return res.json({book:database.books, author:database.author, message:"Successfully deleted book"})
}))*/

booky.delete('/book/delete/author/:isbn/:authorID', async(req, res)=>{
    const updatedBook=await BookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn
        },
        {
            $pull:{
                authors:parseInt(req.params.authorID)
            }
        },
        {
            new:true
        }
    );
    const updatedAuthor=await AuthorModel.findOneAndUpdate(
        {
            id:parseInt(req.params.authorID)
        },
        {
            $pull:{
                books:req.params.isbn
            }
        },
        {
            new:true
        }
    );
    return res.json({Books: updatedBook, Authors: updatedAuthor, message: "Book successfully deleted from the author"});
})

/*
Route           /book/delete/publication
Description     Delete a publication from book
Access          PUBLIC
Parameter       isbn, pub id
Methods         DELETE
*/


booky.delete('/book/delete/publication/:isbn/:pubId', ((req, res)=>{
    //Deleting a publication from book.
    //Approach : Since we want to deal with a sing propertyy of book object first we use forEach loop and then we use filter inside it since it is a array object
    
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn)
        {
            const newPublicationnList=book.publications.filter((publication)=>{
                publication!==parseInt(req.params.pubId);
            });
            book.publications=newPublicationnList;
            return;
        }
    })

    database.publication.forEach((pub)=>{
        if(pub.id===parseInt(req.params.pubId))
        {
            const newBookList=pub.books.filter((book)=>{
                book!==req.params.isbn;
            });
            pub.books=newBookList;
            return;
        }
    })

    return res.json({message:"Suceesfully deleted an author", books: database.books, publications: database.publication});
}))


booky.listen(4000, () => console.log("HEy server is running! 😎"));
