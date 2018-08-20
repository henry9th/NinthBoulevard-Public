var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  link: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  postText: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  category: {
    type: String,
    unique: false,
    required: true
  },
  comments: {
    type: Array,
    required: true,
    default: []
  },
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  upvotedMembers: {
    type: Array,
    required: true,
    default: []
  },
  downvotedMembers: {
    type: Array,
    required: true,
    default: []
  }
},
{
  timestamps: true
});


var Post = mongoose.model('Post', PostSchema);
module.exports = Post;
