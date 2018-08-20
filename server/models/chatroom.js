var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
  roomName: {
    type: String,
    unique: true,
    required: true,
    trim: false
  },
  username1: {
    type: String,
    unique: false,
    required: true
  },
  username2: {
    type: String,
    unique: false,
    required: true
  },
  userId1: {
    type: String,
    unique: false,
    required: true
  },
  userId2: {
    type: String,
    unique: false,
    required: true
  },
  messages: {
    type: Array,
    required: true,
    default: []
  }
});


var Chatroom = mongoose.model('Chatroom', ChatSchema);
module.exports = Chatroom;
