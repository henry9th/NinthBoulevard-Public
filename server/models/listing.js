var mongoose = require('mongoose');

var listingSchema = new mongoose.Schema({

  listingUser: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  //  unique: true, // each listing need different name
  // is it required to have the name
  //  trim: true
  },

  brand: {
    type: String,
    required: true
  },

  type: {
    type: String,
    required: true
  },

  size: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },
  image1: {
    type: String,
    required: true
  },

  image2: {
    type: String,
    required: true
  },

  image3: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true,
    default: 'US'
  },

  description: {
    type: String,
    required: true,
    default: 'This person did not input a description smh'
  },

  shipping: {
    type: Number,
    required: false,
    default: 9
  },

  condition: {
    type: Number,
    required: true
  },

  color: {
    type: String,
    required: true
  },

  followers: {
    type: Array,
    required: true,
    default: []
  }
});





var Listing = mongoose.model('listing', listingSchema); //this asssociates the listingSchemdea with a name, call function on user
module.exports = Listing;
