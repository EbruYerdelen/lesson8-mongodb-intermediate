//here we will start understanding the document references
const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
  name: String,
  bio: String,
});

module.exports = mongoose.model('Author', AuthorSchema);