const Author = require('../models/Author');
const Book = require('../models/Book');

//here we will work on populating the referenced documents
//we will create a new author and a new book and link them together
const createAuthor = async (req, res) => {
  try {
    const authorInfo = req.body;
    const newAuthor = await Author.create({
      name: authorInfo.name,
      bio: authorInfo.bio
    });
    res.status(201).json({
      success: true,
      message: 'Author created successfully',
      data: newAuthor
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error, please try again'
    })
  }
};



const createBook = async (req, res) => {
  try {
    const bookInfo = req.body;

    const author = await Author.findById(bookInfo.authorId);
    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }
    const newBook = await Book.create({
      title: bookInfo.title,
      author:bookInfo.authorId
    });
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error, please try again",
    });
  }
};


//when populating the book,here doc reference logic comes to the stage,cause we can modify the author field in the book schema as the whole referenced Author model
//you will get the belonging author information suitable to schema inside of the author field defined in the book schema
//this is the power of document references
const getBookWithAuthor = async (req, res) => {
try {
  const bookId = req.params.id;
  const book = await Book.findById(bookId).populate('author');
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  res.status(200).json({
    success: true,
    data: book
  });
} catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error, please try again",
    });
}
};

module.exports = { createAuthor, createBook ,getBookWithAuthor};


/*
explanation of how frontend gets all the list of authors,provide the  author._id to the key of related select field,store the selected id into "authorId" state and when we want to make a post request to create a book,
we will send that authorId to the server and the server will find the author with that id which already existed in db store and create a book with that author id

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateBook = () => {
  const [authors, setAuthors] = useState([]);
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');

  useEffect(() => {
    // Fetch authors from the backend
    axios.get('/api/authors')
      .then(response => {
        setAuthors(response.data);
      })
      .catch(error => {
        console.error('Error fetching authors:', error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Ensure both title and authorId are provided
    if (!title || !authorId) {
      alert('Please provide both title and author.');
      return;
    }

    // Send the request to create a new book
    axios.post('/api/books', {
      title: title,
      authorId: authorId
    })
    .then(response => {
      console.log('Book created successfully:', response.data);
      alert('Book created successfully!');
      // Clear the form
      setTitle('');
      setAuthorId('');
    })
    .catch(error => {
      console.error('Error creating book:', error);
      alert('Error creating book. Please try again.');
    });
  };

  return (
    <div>
      <h2>Create a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Book Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="authorSelect">Author:</label>
          <select
            id="authorSelect"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            required
          >
            <option value="">Select Author</option>
            {authors.map(author => (
              <option key={author._id} value={author._id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Book</button>
      </form>
    </div>
  );
};

export default CreateBook;


<select
            id="authorSelect"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            required
          >
            <option value="">Select Author</option>
            {authors.map(author => (
              <option key={author._id} value={author._id}>
                {author.name}
              </option>
            ))}
          </select>
explain
State Management: The authorId state is used to store the selected author's ID. This state is managed using React's useState hook.
Dropdown (Select) Element: The <select> element is used to create a dropdown list of authors. Each <option> within the <select> represents an author.
Setting the authorId State: When a user selects an author from the dropdown, the onChange event handler is triggered. This handler updates the authorId state with the value of the selected option, which is the author's _id.


purpose of the value={authorId}
Controlled Component: In React, a controlled component is a form element whose value is controlled by the state. This means that the value of the form element is always in sync with the state.
value Attribute: The value attribute in the <select> element is set to the authorId state. This ensures that the selected option in the dropdown is always in sync with the authorId state.
*/