/* Got authentication methods and session setup framework from https://github.com/DDCSLearning/authenticationIntro */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cors = require('cors');
var dotenv = require('dotenv').config();
//include cors support
//app.use(cors({credentials: true, origin: 'http://ec2-18-188-186-77.us-east-2.compute.amazonaws.com:3000'}));
app.use(cors({credentials: true, origin: process.env.DOMAIN_NAME}));
//connect to db
mongoose.connect('mongodb://localhost:27017/pirates');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('connected to db');
});

//include sessions
var options = {
  mongooseConnection : db
};

app.use(session({
  secret: 'the_secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore(options),
  cookies: {secure:false}
}));

//include  body-parser for json parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//include router for handling http requests
var router = require('./router/router');
app.use('/', router);

var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', (socket) => {
    socket.on('join', (data) => {
        for(var i = 0 ; i < data.length; i++) {
            var found = false;
            for(var room in socket.rooms) {
                if (room == data[i]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.log("joined" + data[i]);
                socket.join(data[i]);
            }
        }
        console.log(data);
        console.log(socket.rooms);
    });
    socket.on('reload', (data) => {
        console.log(data);
        console.log(socket.rooms);
        socket.broadcast.to(data).emit('update', data);
    });
    socket.on('resetRooms', () => {
        for(var room in socket.rooms) {
            socket.leave(room);
        }
        console.log(socket.rooms);
    });
});
server.listen(3001);

/*
app.listen(3001, function () {
  console.log('Express app listening on port 3001');
});
*/
