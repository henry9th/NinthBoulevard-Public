var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  first: {
    type: String,
    required: true
  },
  last: {
    type: String,
    required: true
  },
  watching: {
    type: Array,
    required: true,
    default: []
  },
  stores: {
    type: Array,
    required: true,
    default: []
  },
  followers: {
    type: Array,
    required: true,
    default: []
  },
  notifications: {
    type: Array,
    required: true,
    default: []
  },
  buyerRating: {
    type: Number,
    required: true,
    default: 9
  },
  sellerRating: {
    type: Number,
    required: true,
    default: 9
  },
  numBuys: {
    type: Number,
    required: true,
    default: 0

  },
  numSells: {
    type: Number,
    required: true,
    default: 0
  },
  verificationId : {
    type: String,
    required: false,
  },
  verifiedStatus: {
    type: Boolean,
    required: true,
    default: false
  }
},
{
  timestamps: true
});

//authentication procedure: find user then compare pwds
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

// hash password before storing in db
UserSchema.pre('save', function (next) {
  if (!this.isNew) {
    console.log("notnew");
     return next();
  }
else {
console.log("new");
     var user = this;
  var salt = bcrypt.genSaltSync(10);
  bcrypt.hash(user.password, salt, null, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
}
});

var User = mongoose.model('User', UserSchema); //this asssociates the listingSchemdea with a name, call function on user
module.exports = User;
