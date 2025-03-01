//each author can have multiple books so we have to reference those authors here in the book model
const mongoose = require('mongoose');


const BookSchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
});



module.exports = mongoose.model('Book', BookSchema);

/*
In MongoDB and Mongoose, you can create relationships between different collections. In this case, you are creating a relationship between the Book and Author collections. This is done using a reference.
type: mongoose.Schema.Types.ObjectId: This specifies that the author field will store an ObjectId. ObjectIds are unique identifiers used by MongoDB to identify documents in a collection.
ref: 'Author': This creates a reference to the Author collection. The ref option tells Mongoose which model to use during population. In this case, it refers to the Author model.
By creating this reference, you can easily retrieve the author details when querying the Book collection. This is known as population in Mongoose, and it allows you to retrieve related documents from other collections.
*/