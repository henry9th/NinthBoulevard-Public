var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Listing = require('../models/listing');
var Post = require('../models/post');
var aws = require('aws-sdk');
var dotenvInit = require('dotenv').config();
var ObjectId = require('mongoose').Types.ObjectId;
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var Chatroom = require('../models/chatroom');
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/register', function(req, res, next) {
    var rand = Math.floor((Math.random() * 100) + 54);
    var createData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      image: req.body.image,
      first: req.body.firstName,
      last: req.body.lastName,
      verificationId: rand,
      verifiedStatus: false
    };
    User.create(createData, function (error, user) {
      if (error) {
        console.log(error);
        if (error.code == 11000) {
            var dupField = error.message.split('.$')[1];
            dupField = dupField.split(' dup key')[0];
            dupField = dupField.substring(0, field.lastIndexOf('_'));
            var responseData = {
                success : 'false',
                data: {
                    reason: "duplicate field",
                    field: dupField
                }
            }
            res.send(responseData);
        }
    else {
            var responseData = {
                success : 'false',
                data : {
                    reason: 'unknown'
                }
            }
            res.send(responseData);
        }
        //return next(error);
      } else {
            var verifyLink = "http://ninthblvd.com/verify?id=" + rand + "&email=" + req.body.email;
    var mailOptions = {
        to: req.body.email,
        subject: "Verify Email for Ninth Blvd",
        html: verifyLink
    };
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {

            console.log("error sending email");
            var responseData = {
                success : 'true',
                    data : {
                        response: "creation success but email not sent"
                    }
            }
            res.send(responseData);
        }
        else {
            var responseData = {
                success : 'true',
                    data : {
                        response: "creation success and email sent"
                    }
            }
            res.send(responseData);
        }
    });
}
       // req.session.userId = user._id; //when I log in, associate with the log
       // req.session.username = user.username;
        //when the ip request me, he is this guy,
});

});

router.get('/verify', function(req, res, next) {
    console.log(req.query.id);
    console.log(req.query.email);
    User.findOne({email : req.query.email}, function(err,user) {
        if (err || !user) {
            var responseData = {
                success: 'false',
                data: {
                    response: 'invalid link',
                    reason: 'email not associated with account'
                }
            };

            return res.send(responseData);
        }
        if (user.verifiedStatus == true) {
           var responseData = {
                success: 'false',
                data: {
                    response: 'invalid link',
                    reason: 'account already verified'
                }
            };
            return res.send(responseData);

        }
        if (user.verificationId == req.query.id) {
            user.verifiedStatus = true;
            user.save(function(err) {
                if(err) {
                    var responseData = {
                        success: 'false',
                        data: {
                            response: 'try again later',
                            reason: 'server down'
                        }
                    };
                    return res.send(responseData);
                }
                else {
                    console.log(req.query.email + ' success verify');
                    var responseData = {
                        success: 'true',
                        data: {
                            response: 'successfully verified'
                        }
                    };
                    return res.send(responseData);
                }
            });
        }
    });
})

router.post('/uploadProf', function(req, res, next) {
  var filename = req.body.fileName;
  var filetype = req.body.fileType;

  aws.config.update({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
  });
  var s3 = new aws.S3({region: 'us-east-2', signatureVersion: 'v4'});

  var params = {
    Bucket: "prof-image",
    Key: filename,
    Expires: 300,
    ContentType: filetype
  };

  s3.getSignedUrl('putObject', params, function(err, data) {
    if (err) {
      console.log(err);
      return err;
    } else {
      return res.send(data);
    }

  });

});

router.post('/uploadListing', function(req, res, next) {
  var filename = req.body.fileName;
  var filetype = req.body.fileType;

  aws.config.update({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
  });
  var s3 = new aws.S3({region: 'us-east-2', signatureVersion: 'v4'});

  var params = {
    Bucket: "list-image",
    Key: filename,
    Expires: 300,
    ContentType: filetype
  };

  s3.getSignedUrl('putObject', params, function(err, data) {
    if (err) {
      console.log(err);
      return err;
    } else {
      return res.send(data);
    }

  });
});

router.post('/checkUsername', function(req,res,next) {
    var name = req.body.username;
    User.findOne({username : name})
    .exec(function(error, user) {
        if (!user) {
            var responseData = {
                taken: 'false'
            }
            res.send(responseData);
        }
        else {
            var responseData = {
                taken: 'true'
            }
            res.send(responseData);
        }
    });
});

router.post('/checkEmail', function(req,res,next) {
    var newemail = req.body.email;
    User.findOne({email : newemail})
    .exec(function(error, user) {
        if (!user) {
            var responseData = {
                taken: 'false'
            }
            res.send(responseData);
        }
        else {
            var responseData = {
                taken: 'true'
            }
            res.send(responseData);
        }
    });
});

router.post('/registerr', function(req, res, next) {
  var createData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      image: req.body.image,
      first: req.body.firstName,
      last: req.body.lastName
    };
    User.create(createData, function (error, user) {
      if (error) {
        console.log(error);
        if (error.code == 11000) {
            var dupField = error.message.split('.$')[1];
            dupField = dupField.split(' dup key')[0];
            dupField = dupField.substring(0, field.lastIndexOf('_'));
            var responseData = {
                success : 'false',
                data: {
                    reason: "duplicate field",
                    field: dupField
                }
            }
            res.send(responseData);
        }
        else {
            var responseData = {
                success : 'false',
                data : {
                    reason: 'unknown'
                }
            }
            res.send(responseData);
        }
        //return next(error);
      } else {

       // req.session.userId = user._id; //when I log in, associate with the log
       // req.session.username = user.username;
        //when the ip request me, he is this guy,
        var responseData = {
    	    success : 'true',
            data : {
	        response: "creation success"
	    }
	}
	return res.send(responseData);
      }
  });
});


router.post('/newPost', function(req, res, next) {

  if( typeof req.session.username == 'undefined'){
    res.send("no user");
    return;
  }

  var createData = {
      title: req.body.title,
      category: req.body.category,
      postText: req.body.postText,
      link: req.body.link,
      username: req.session.username
    };

    Post.create(createData, function (error, post) {
      if (error) {
        console.log(error);
        if (error.code == 11000) {
            var dupField = error.message.split('.$')[1];
            dupField = dupField.split(' dup key')[0];
            dupField = dupField.substring(0, field.lastIndexOf('_'));
            var responseData = {
                success : 'false',
                data: {
                    reason: "duplicate field",
                    field: dupField
                }
            }
            res.send(responseData);
        }
        else {
            var responseData = {
                success : 'false',
                data : {
                    reason: 'unknown'
                }
            }
            res.send(responseData);
        }
        //return next(error);
      } else {
        var responseData = {
    	    success : 'true',
            data : {
	        response: "post creation success"
	    }
	}
	return res.send(responseData);
      }
  });
});



router.post('/addToWatching', function(req, res, next) {
  // ADD TO USER WATCHING
  User.findOneAndUpdate(
    { username: req.session.username },
    { $addToSet: { watching: req.body.id }}, function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
        return res.send(err);
    }
    // ADD TO LISTING FOLLOWERS
    Listing.findOneAndUpdate(
      { _id: req.body.id },
      { $addToSet: { followers: req.session.username }}, function(err, doc){
      if(err){
          console.log("Something wrong when updating data!");
          return res.send(err);
      }
      console.log(doc);
      return res.send("success");
    });
    });
});

router.post('/removeFromWatching', function(req, res, next) {
  // ADD TO USER WATCHING
  User.findOneAndUpdate(
    { username: req.session.username },
    { $pull: { watching: req.body.id }}, function(err, doc){
    if(err){
        console.log("Something wrong when removing data!");
        return res.send(err);
    }
      // ADD TO LISTING FOLLOWERS
      Listing.findOneAndUpdate(
        { _id: req.body.id },
        { $pull: { followers: req.session.username }}, function(err, doc){
        if(err){
            console.log("Something wrong when removing data!");
            return res.send(err);
        }
        console.log(doc);
        return res.send("success");
      });
  });

});
router.get('/getUsername', function(req,res,next) {
    if (typeof req.session.username != 'undefined') {
        var responseData = {
            success: true,
            data: {
                username: req.session.username
            }
        }
        return res.send(responseData);
    }
    else {
        var responseData = {
            success: false,
            data: {
                reason: 'no session found'
            }
        }
        return res.send(responseData);
    }
});

router.get('/getUserChats', function(req, res, next) {
    Chatroom.find({
        $or: [
            {username1 : req.session.username},
            {username2 : req.session.username},
        ],
    }, function(error, chats) {
        if (error || !chats) {
            var responseData = {
                success: 'false',
                data: error
            };
            return res.send(responseData);
        }
        var usernames = [];
        var roomnames = [];
        var userids = [];
        var currentusername = req.session.username;
        for (var i = 0; i < chats.length; i++) {
            if (chats[i].username1 == currentusername) {
                usernames.push(chats[i].username2);
                roomnames.push(chats[i].roomName);
                userids.push(chats[i].userId2);
            }
            else {
                usernames.push(chats[i].username1);
                roomnames.push(chats[i].roomName);
                userids.push(chats[i].userId1);
            }
        }
        var responseData = {
            success: 'true',
            data: {
                usernames: usernames,
                roomnames: roomnames,
                userids: userids
            }
        }
        return res.send(responseData);
    });
});
router.post('/createChatroom', function(req,res,next) {
    var firstUserId = req.session.userId;
    var secondUserId = req.body.otherUserId;
    console.log(firstUserId);
    console.log(secondUserId);
    if(!mongoose.Types.ObjectId.isValid(secondUserId)) {
        return res.send("failed");
    }
    var firstUsername = "";
    var secondUserName = "";
    var roomName = "";
    if (firstUserId < secondUserId) {
        roomName = firstUserId + secondUserId;
    }
    else {
        roomName = secondUserId + firstUserId;
    }
    User.findById(mongoose.Types.ObjectId(firstUserId), function(error, user) {
        firstUsername = user.username;
        User.findById(mongoose.Types.ObjectId(secondUserId), function(error, user) {
            if(error || !user) {
                return res.send("failed");
            }
            secondUsername = user.username;
            var createChatroomData = {
                roomName: roomName,
                username1: firstUsername,
                username2: secondUsername,
                userId1: firstUserId,
                userId2: secondUserId
            };
            Chatroom.create(createChatroomData, function(error, chatroom) {
                if(error || !chatroom) {
                    var responseData = {
                        success : 'false',
                        data : {
                            response: "unable to create chatroom"
                        }
                    }
                    return res.send(responseData);
                }
                var responseData = {
                    success : 'true',
                    data : {
                        response: "chatroom creation success"
                    }
                }
                return res.send(responseData);
            });
        });
    });
});

router.post('/newMessage', function(req, res, next) {
  console.log('newchat');
  var data = {
    sender: req.body.sender,
    message: req.body.message,
    date: Date.now(),
  }
  Chatroom.findOneAndUpdate(
    { roomName: req.body.roomname },
    { $push: { messages: data }},
    { new: true}, function(err, chatroom){
    if(err){
        console.log("Something wrong when adding a new message!");
        return res.send(err);
    }
    return res.send(chatroom.messages);
  });
});

router.post('/getChat', function(req,res,next) {
  console.log("getchat");
  Chatroom.findOne({roomName: req.body.roomname}).exec(function (err, room) {
    if (err | !room) {
        console.log(err);
        return res.send(err);
    }
    return res.send(room.messages);
  });
});
router.post('/createListing', function(req, res, next) {

  if( typeof req.session.username == 'undefined'){
    var responseData = {
        success : 'false',
        data : {
          response: "You are not Logged in"
        }
    }
    return res.send(responseData);
  }
  else {
    var createListingData = {
        listingUser: req.session.username,
        name: req.body.name,
        brand: req.body.brand,
        type: req.body.type,
        size: req.body.size,
        price: req.body.price,
        image1: req.body.image1,
        image2: req.body.image2,
        image3: req.body.image3,
        location: req.body.location,
        description: req.body.description,
        condition : req.body.condition,
        shipping: req.body.shippingPrice,
        color: req.body.color,
      };
      Listing.create(createListingData, function (error, listing) {
        if (error) {
          console.log(error);
          return next(error);
        } else {

        //  req.session.userId = user._id;
          var responseData = {
      	    success : 'true',
              data : {
  	             response: "listing creation success"
  	           }
  	       }
  	       return res.send(responseData);
        }
      });
  }
});

router.get('/test', function(req, res, next) {
    var responseData = {
        success: 'true',
        data : {
	      id: req.session.userId
        }
    }
    return res.send(responseData);
});

router.get('/getNotifications', function(req, res, next) {
    if (typeof req.session.userId == 'undefined') {
        var responseData = {
            success: false,
            data: {
                reason: 'user not logged in'
            }
        }
        return res.send(responseData);
    }
    User.findById(req.session.userId)
    .exec(function (error, user) {
        var responseData = {
            success: 'true',
            data: {
                notifications: user.notifications
            }
        }
        return res.send(responseData);
    })
});

router.post('/getListings', function(req, res, next) {

    var shift = req.body.shift;
    var numListings = req.body.numListings;

    var search, location, category, size, minPrice, maxPrice, color, condition;

    var filter = req.body.filter;
    console.log(filter);
    if (!filter) { filter = []; }

    if (!filter.search) {
      console.log("empty");
      search = new RegExp(/[\s\S]+/);
    } else {
      search = new RegExp(filter.search, "i");
    }

    if (!filter.minPrice) {
      console.log("no minPrice");
      minPrice = 0;
    } else {
      minPrice = filter.minPrice;
    }

    if (!filter.maxPrice) {
      console.log("no maxPrice");
      maxPrice = Number.MAX_SAFE_INTEGER;
    } else {
      maxPrice = filter.maxPrice;
    }

    if (!req.body.color) {
      console.log("no color");
      color = new RegExp(/[\s\S]+/);
    } else {
      color = filter.color;
    }

    if (!filter.condition) {
      console.log("no condition");
      condition = -1;
    } else {
      condition = filter.condition;
    }

    if (!filter.location) {
      console.log("no location");
      location =  new RegExp(/[\s\S]+/);
    } else {
      location = filter.location;
    }

    if (!filter.category) {
      console.log("no category");
      category = new RegExp(/[\s\S]+/);
    } else {
      category = filter.category;
    }

    if (!filter.size) {
      console.log("no size");
      size = new RegExp(/[\s\S]+/);
    } else {
      size = filter.size;
    }

    Listing.find({
      $or: [ { name: search }, { brand: search }],
      type: category,
      location: location,
      size: size,
      color: color,
      price: {$gt: minPrice, $lt: maxPrice},
      condition: {$gt: condition, $lt: 11}
    }, function(err, listings) {
        console.log(listings);
        var response = {};
        var index = 0;
        listings.forEach(function(listing) {
            response[index] = {
                id: listing._id,
                size: listing.size,
                name: listing.name,
                brand: listing.brand,
                price: listing.price,
                image: listing.image1
            }
            index++;
        });
        res.send(response);
    }).sort({date: -1}).skip(shift).limit(numListings);
});


router.post('/getPosts', function(req, res, next) {
    var shift = req.body.shift;
    var postsPerPage = req.body.postsPerPage;
    var inputCategory = req.body.category;
    var sortBy = req.body.sortBy;
    var j = {

    };
    j[sortBy] = -1;

    if (inputCategory === "") {
      inputCategory = new RegExp(/[\s\S]+/);
    }
    console.log(j);

    Post.find({category: inputCategory}, function(err, posts) {
        if(err || !posts) {
            console.log(err);
            return;
        }
        var response = {};
        var index = 0;
        posts.forEach(function(post) {
            response[index] = {
                title: post.title,
                category: post.category,
                username: post.username,
                postText: post.postText,
                date: post.date,
                link: post.link,
                id: post._id,
                rating: post.rating
            }
            index++;
        });
        res.send(response);
    }).sort(j).skip(shift).limit(postsPerPage);
});



router.post('/getWatching', function(req, res, next) {
  var shift = req.body.shift;
  var numListings = req.body.numListings;

    var query = User.findOne({username: req.session.username});
    query.exec(function (err, user) {
      if (err) {
          return res.send(err);
      }
      else if (!user) {
          var responseJson =  {
              success : 'false',
              data : {
                  reason: 'could not get user info'
              }
          };
          return res.send(responseJson);
      } else {
         var watchingItems = user.watching;
         Listing.find(
           { _id: { $in: watchingItems }
         }, function(err, listings) {
         var response = {};
         var index = 0;
         listings.forEach(function(listing) {
           response[index] = {
               id: listing._id,
               size: listing.size,
               name: listing.name,
               brand: listing.brand,
               price: listing.price,
               image: listing.image1
           }
           index++;
         });
         res.send(response);
       }).sort({date: -1}).skip(shift).limit(numListings);

      }
    });
});


router.get('/getStores', function(req, res, next) {
    var query = User.findOne({username: req.session.username});
    query.exec(function (err, user) {
      if (err) {
          return res.send(err);
      }
      else if (!user) {
          var responseJson =  {
              success : 'false',
              data : {
                  reason: 'could not get user info'
              }
          };
          return res.send(responseJson);
      } else {
         var stores = user.stores;
         User.find(
           { username: { $in: stores }
         }, function(err, stores) {
         var response = {};
         var index = 0;
         stores.forEach(function(store) {
           response[index] = {
               id: store._id,
               storeName: store.username,
           }
           index++;
         });
         res.send(response);
       });

      }
    });
});


router.post('/newPostComment', function(req, res, next) {

  if( typeof req.session.username == 'undefined'){
    res.send("no user");
    return;
  }
  var data = {
    username: req.session.username,
    comment: req.body.comment,
    date: Date.now(),
    _id: ObjectId(),
    replies: [],
    rating: 0,
    upvotedMembers: [],
    downvotedMembers: []
  }
  Post.findOneAndUpdate(
    { _id: req.body.id },
    { $push: { comments: data }}, function(err, doc){
    if(err){
        console.log("Something wrong when updating comments data!");
        return res.send(err);
    }
    var owner = doc.username;
    var title = doc.title;
    var notification = "Someone commented on your post " + title;
    User.findOneAndUpdate({username: owner},
        {$push: {notifications: notification}}, function(err, user) {
            if (err || !user) {
                console.log("hyunrae you fucked up");
            }
            else {

            }
    });
    return res.send(doc);
  });
});

router.post('/newCommentReply', function(req, res, next) {

  if( typeof req.session.username == 'undefined'){
    return res.send("no user");

  }

  var data = {
    username: req.session.username,
    reply: req.body.reply,
    date: Date.now(),
    _id: ObjectId(),
  }

  Post.findOne(
    { _id: req.body.id },
     function(err, doc){
      if(err){
          console.log("Something wrong when updating comment's reply data!");
          return res.send(err);

      } else {
        for (var i = 0; i < doc.comments.length; i++) {
          console.log("COMPARE HERE");
          console.log(doc.comments[i]._id);
          console.log(req.body.commentId);
            if (doc.comments[i]._id == req.body.commentId) {
              console.log(doc);

                var array = [];
                for (var j = 0; j < doc.comments[i].replies.length; j++) {
                  array.push(docs.comments[i].replies[j]);
                }
                array.push(data);
                doc.comments[i].replies = array;
                doc.markModified('comments');
                //doc.comments[i].replies.push(data);
                console.log(doc.comments[i].replies);
                console.log(doc);
                doc.save(function(err, updated) {
                    if(err) {
                        var responseData = {
                            success: 'false',
                            data: {
                                response: 'try again later',
                                reason: 'server down'
                            }
                        };
                        return res.send(responseData);
                    }
                    else {
                      console.log(updated);
                        console.log(req.query.email + ' success verify');
                        var responseData = {
                            success: 'true',
                            data: {
                                response: 'successfully verified'
                            }
                        };
                        return res.send(updated);
                    }
                });
            }

        }

      }
      //return res.send(doc);
  });
});




router.post('/addStoreToWatching', function(req, res, next) {
  // ADD TO USER WATCHING
  User.findOneAndUpdate(
    { username: req.session.username },
    { $addToSet: { stores: req.body.storeUsername }}, function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
        res.send(err);
    }
    // ADD TO LISTING FOLLOWERS
    User.findOneAndUpdate(
      { username: req.body.storeUsername },
      { $addToSet: { followers: req.session.username }}, function(err, doc){
      if(err){
          console.log("Something wrong when updating data!");
          return res.send(err);
      }
      console.log(doc);
      return res.send("success");

    });
  });


});

router.post('/removeStoreFromWatching', function(req, res, next) {
  // ADD TO USER WATCHING
  User.findOneAndUpdate(
    { username: req.session.username },
    { $pull: { stores: req.body.storeUsername }}, function(err, doc){
    if(err){
        console.log("Something wrong when removing data!");
    }
    console.log(doc);
    User.findOneAndUpdate(
      { username: req.body.storeUsername },
      { $pull: { followers: req.session.username }}, function(err, doc){
      if(err){
          console.log("Something wrong when removing data!");
          return res.send(err);
      }
      console.log(doc);
      return res.send("success");
    });
  });

});

router.post('/listingDetails', function(req, res, next) {
    var query = Listing.findById(req.body.id);
    console.log(req.body.id);
    query.exec(function (err, listing) {
        if (err) {
            return res.send(err);
        }
        else if (!listing) {
            var responseJson =  {
                success : 'false',
                data : {
                    reason: 'could not find listing'
                }
            }
            return res.send(responseJson);
        }
        else {
          query = User.findOne({username: listing.listingUser});
          query.exec(function (err, user) {
            if (err) {
                return res.send(err);
            }
            else if (!user) {
                var responseJson =  {
                    success : 'false',
                    data : {
                        reason: 'could not get user info'
                    }
                }
                return res.send(responseJson);
            } else {
              var checkAdded = false;
              if (listing.followers.includes(req.session.username)) {
                  checkAdded = true;
              }
                  var listingData = {
                      pieceName : listing.name,
                      brand : listing.brand,
                      location : listing.location,
                      size : listing.size,
                      price : listing.price,
                      condition: listing.condition,
                      images : {
                          first : listing.image1,
                          second : listing.image2,
                          third : listing.image3,
                      },
                      description : listing.description,
                      sellerUsername: listing.listingUser,
                      sellerImage: user.image,
                      sellerID: user._id,
                      added: checkAdded
                  }
                  var responseJson = {
                      success : 'true',
                      data : listingData
                  }
                  return res.send(responseJson);
            }


          });
        }
    });
});



router.post('/postDetails', function(req, res, next) {
    var query = Post.findById(req.body.id);
    query.exec(function (err, post) {
        if (err) {
            return res.send(err);
        }
        else if (!post) {
            var responseJson =  {
                success : 'false',
                data : {
                    reason: 'could not find post'
                }
            }
            return res.send(responseJson);
        }
        else {
          query = User.findOne({username: post.username});
          query.exec(function (err, user) {
            if (err) {
                return res.send(err);
            }
            else if (!user) {
                var responseJson =  {
                    success : 'false',
                    data : {
                        reason: 'could not get user info'
                    }
                }
                return res.send(responseJson);
            } else {
                  var self = false;
                  if (post.username === req.session.username) {
                    self = true;
                  }
                  var comments = {};
                  var index = 0;
                  post.comments.forEach(function(comment) {
                    var self = false;
                    if (comment.username == req.session.username) {
                      self = true;
                    }
                    var userRating = null;
                    if (comment.upvotedMembers.indexOf(req.session.username) !== -1) {
                      userRating = "up";
                    }
                    else if (comment.downvotedMembers.indexOf(req.session.username) !== -1) {
                      userRating = "down";
                    }
                      comments[index] = {
                          username: comment.username,
                          comment: comment.comment,
                          date: comment.date,
                          id: comment._id,
                          oc: self,
                          replies: comment.replies,
                          rating: comment.rating,
                          userRating: userRating
                      }
                      index++;
                  });

                  var userRating = null;

                  if (post.upvotedMembers.indexOf(req.session.username) !== -1) {
                    userRating = "up";
                  }
                  else if (post.downvotedMembers.indexOf(req.session.username) !== -1) {
                    userRating = "down";
                  }

                  var postData = {
                      title: post.title,
                      category: post.category,
                      username: post.username,
                      postText: post.postText,
                      date: post.date,
                      link: post.link,
                      comments: comments,
                      userImage: user.image,
                      userID: user._id,
                      op: self,
                      rating: post.rating,
                      userRating: userRating
                  }
                  var responseJson = {
                      success : 'true',
                      data : postData
                  }
                  return res.send(responseJson);
            }


          });
        }
    });
});

router.post('/deletePost', function(req, res, next) {
    var query = Post.deleteOne( { _id: req.body.id} );
    query.exec(function (err) {
        if (err) {
            return res.send(err);
        }
        else {
            var responseJson = {
                success : 'true',
                message : 'post was successfuly deleted'
            }
            return res.send(responseJson);
        }
    });
});

router.post('/deleteComment', function(req, res, next) {
    console.log(req.body.commentId);
    console.log(req.body.postId);
    var query = Post.update(
      { _id: mongoose.Types.ObjectId(req.body.postId)},
      { $pull: { 'comments': { _id: mongoose.Types.ObjectId(req.body.commentId) }}}
    );
    query.exec(function (err) {
        if (err) {
            return res.send(err);
        }
        else {
            var responseJson = {
                success : 'true',
                message : 'comment was successfuly deleted'
            }
            return res.send(responseJson);
        }
    });
});

router.post('/getComments', function(req, res, next) {
    var query = Post.findById(req.body.id);
    query.exec(function (err, post) {
        if (err) {
            return res.send(err);
        }
        else if (!post) {
            var responseJson =  {
                success : 'false',
                data : {
                    reason: 'could not find post'
                }
            }
            return res.send(responseJson);
        }
        else {
          var response = {};
          var index = 0;
          post.comments.forEach(function(comment) {
            var self = false;
            if (comment.username == req.session.username) {
              self = true;
            }

            var userRating = null;
            if (comment.upvotedMembers.indexOf(req.session.username) !== -1) {
              userRating = "up";
            }
            else if (comment.downvotedMembers.indexOf(req.session.username) !== -1) {
              userRating = "down";
            }

              response[index] = {
                  username: comment.username,
                  comment: comment.comment,
                  date: comment.date,
                  id: comment._id,
                  oc: self,
                  rating: comment.rating,
                  replies: comment.replies,
                  userRating: userRating
              }
              index++;
          });

            return res.send(response);
        }
    });
});

router.post('/login', function(req, res, next) {
  User.authenticate(req.body.email, req.body.password, function (error, user) {
    if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        //return next(err);
        var responseData = {
            success: 'false',
            data : {
                 reason: 'Failed Auth'
            }
        }
        //return res.send(err);
        return res.send(responseData);
    } else {
        if (user.verifiedStatus == false) {
            var responseData = {
                success: 'false',
                data : {
                     reason: 'Unverified User'
                }
            }
            return res.send(responseData);
        }
        req.session.userId = user._id;
        req.session.username = user.username;
        //console.log(req.session);
        var responseData = {
            success: 'true',
            data : {
                 id: req.session.userId
            }
        }
	return res.send(responseData);
        //return res.redirect('/profile');
    }
  });
});

router.post('/profile', function (req, res, next) {
  var name = req.session.userId;
  var isSelf = false;
  if (req.body.id != "") {
    name = req.body.id;
  }
  else {
    isSelf = true;
  }
  User.findById(name)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          var responseData = {
            success : false,
            data : {
                reason: "Not Logged In"
            }
          }
          return res.send(responseData);
          //return next(err);
        } else {
          var response = {};
          Listing.find({listingUser: user.username }, function(err, listings) {
              var index = 0;
              listings.forEach(function(listing) {

            response[index] = {
                      id: listing._id,
                      size: listing.size,
                      name: listing.name,
                      brand: listing.brand,
                      price: listing.price,
                      image: listing.image1
                  }
                  index++;
              });

              var checkAdded = false;
              if (user.followers.includes(req.session.username)) {
                  checkAdded = true;
              }

         if (req.body.id == req.session.userId) {
            checkAdded = "self";
          }

          var userData = {
            username: user.username,
            image: user.image,
            first: user.first,
            last: user.last,
            createDate: user.createdAt,
            listings: response,
            added: checkAdded,
            selfProfile: isSelf
          };

          var responseData = {
            success : true,
            data : userData
          };
          return res.send(responseData);
            });
          //return res.send('You are:' + user.username + 'Memeber since ' + user.createdAt);
        }
      }
    });
});

router.post('/upRating', function (req, res, next) {
  var increment = req.body.increment;
  console.log("upRating: " + increment);

  var query;
  if (increment == 2) {
    query = Post.update(
      { _id: req.body.postId},
        {
         $inc: { rating: increment},
         $push: { upvotedMembers: req.session.username },
         $pull: { downvotedMembers: req.session.username }
       }
    );
  } else {
      query = Post.update(
        { _id: req.body.postId},
          {
           $inc: { rating: increment},
           $push: { upvotedMembers: req.session.username }
         }
      );
    }
  query.exec(function (err) {
      if (err) {
          return res.send(err);
      }
      else {
          var responseJson = {
              success : 'true',
              message : 'rating was successfuly incremented'
          }
          return res.send(responseJson);
      }
  });

});

router.post('/downRating', function (req, res, next) {
  var increment = req.body.increment;
  var query;
  console.log("downRating: " + increment);
  if (increment == -2) {
    query = Post.update (
      { _id: req.body.postId},
        {
         $inc: { rating: increment},
         $pull: { upvotedMembers: req.session.username },
         $push: { downvotedMembers: req.session.username }
       }
    );
  } else {
    query = Post.update (
      { _id: req.body.postId},
        {
         $inc: { rating: increment},
         $push: { downvotedMembers: req.session.username }
       }
    );

  }

  query.exec(function (err) {
      if (err) {
          return res.send(err);
      }
      else {
          var responseJson = {
              success : 'true',
              message : 'rating was successfuly decremented'
          }
          return res.send(responseJson);
      }
  });

});


router.post('/upCommentRating', function (req, res, next) {
  var postId = req.body.postId;
  var commentId = req.body.commentId;
  var userRating = req.body.userRating;
  var increment;
  if (userRating == "up") { // cancel rating
    increment = -1;
    Post.findOne(
      { _id: postId },
       function(err, doc){
        if(err){
            console.log("Something wrong when canceling comment's reply data!");
            return res.send(err);
        } else {
          for (var i = 0; i < doc.comments.length; i++) {
              if (doc.comments[i]._id == commentId) {
                console.log(doc);
                  var array = [];
                  for (var j = 0; j < doc.comments[i].upvotedMembers.length; j++) {
                    if (doc.comments[i].upvotedMembers[j] == req.session.username) { // last looked here

                    }
                    array.push(docs.comments[i].replies[j]);
                  }
                  array.push(data);
                  doc.comments[i].replies = array;
                  doc.markModified('comments');
                  //doc.comments[i].replies.push(data);
                  console.log(doc.comments[i].replies);
                  console.log(doc);
                  doc.save(function(err, updated) {
                      if(err) {
                          var responseData = {
                              success: 'false',
                              data: {
                                  response: 'try again later',
                                  reason: 'server down'
                              }
                          };
                          return res.send(responseData);
                      }
                      else {
                        console.log(updated);
                          console.log(req.query.email + ' success verify');
                          var responseData = {
                              success: 'true',
                              data: {
                                  response: 'successfully verified'
                              }
                          };
                          return res.send(updated);
                      }
                  });
              }

          }

        }
        //return res.send(doc);
    });


  } else if (userRating == "down") { // increment by two
    increment = 2;



  } else { // increment by one
    increment = 1;



  }

});

router.post('/downCommentRating', function (req, res, next) {
  var postId = req.body.postid;
  var commentId = req.body.commentId;
  var userRating = req.body.userRating;
  var increment;
  if (userRating == "up") { // decrement by 2
    increment = -2;



  } else if (userRating == "down") { // cancel rating
    increment = 2;



  } else { // decrement by 1
    increment = 1;



  }

});




router.post('/cancelRating', function (req, res, next) {
  console.log("cancelRating called");
  var upDown = req.body.upDown;
  var query;

  // canceling upvote
  if (upDown === "up") {
    query = Post.update(
      { _id: req.body.postId},
        {
         $inc: { rating: -1},
         $pull: { upvotedMembers: req.session.username }
       }
    );
  } else { // canceling downvote
    query = Post.update(
      { _id: req.body.postId},
        {
         $inc: { rating: 1},
         $pull: { downvotedMembers: req.session.username }
       }
    );
  }

  query.exec(function (err) {
      if (err) {
          return res.send(err);
      }
      else {
          var responseJson = {
              success : 'true',
              message : 'rating was successfuly decremented'
          }
          return res.send(responseJson);
      }
  });

});

router.get('/logout', function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        //return res.redirect('/');
        return res.send("logged out");
      }
    });
  }
});

module.exports = router;
