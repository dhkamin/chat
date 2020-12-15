const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./db/db');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express()
const http = require('http')
const server = http.Server(app)
const socketIo = require("socket.io");

const users = require('./routes/user');
const rooms = require('./routes/rooms');
const messages = require('./routes/message');
const permission = require('./utils/permission')

const User = require('./models/User');
const Room = require('./models/Rooms');
const Message = require('./models/Message');
const Sharing = require('./models/Sharing');
const Advertising = require('./models/Advertising');
const Setting = require('./models/Setting');

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, application/json, charset=utf-8, X-Requested-With');
  next();
};

mongoose.connect(config.DB, { useNewUrlParser: true }).then(() => { console.log('Database is connected') },
  err => { console.log('Can not connect to the database ' + err) }
);
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(allowCrossDomain);

require('./passport/passport')(passport);
const io = socketIo(server);

//amin  
// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', users);
app.use('/api', rooms);
app.use('/api', messages);
app.get('/', function (req, res) {
  res.send('hello');
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

//server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

/**
 * Socket Io
 */
io.on("connection", socket => {
  console.log('Client Connected', socket.id);
  /**
    * Upload Photo Video Message
    */
  socket.on("upload-photo-video-message", function (upload) {
    if (upload.file) {
      /* const fileName = path.join(__dirname, '../public/images', data.file)
       const tmpFileName = path.join('/images', data.file)
       const imageBuffer = imageDecoder(buffer)      
   
       fs.open(fileName, 'a+', (err, fd) => {
         if (err) throw err;
   
         fs.writeFile(fileName, imageBuffer.data, {encoding: 'base64'}, (err) => { 
           fs.close(fd, () => {
             let message = Message({user: user, room: room, image: tmpFileName})
             
             message.save((err) => {
               if (err) return err
             }) 
             console.log('file saved successfully!')
           });
         })
       })*/
      if (!fs.existsSync("public")) {
        fs.mkdir("public", function (err) {
          if (err) {
            socket.emit('upload-file-message', err);
          }
        });
      }
      if (!fs.existsSync("public/rooms")) {
        fs.mkdir("public/rooms", function (err) {
          if (err) {
            socket.emit('upload-file-message', err);
          }
        });
      }
      if (!fs.existsSync("public/rooms/" + upload.user_id)) {
        fs.mkdir("public/rooms/" + upload.roomId, { recursive: true }, function (err) {
          if (err) {
            socket.emit('upload-file-message', err);
          }
        });
      }
      if (!fs.existsSync("public/rooms/" + upload.user_id + "/file")) {
        fs.mkdir("public/rooms/" + upload.user_id + "/file", { recursive: true }, function (err) {
          if (err) {
            socket.emit('upload-file-message', err);
          }
        });
      }
      let file = "public/rooms/" + upload.user_id + "/file/" + upload.file.originalname;
      fs.readFile(upload.file.path, function (err, data) {
        if (err) {
          socket.emit('upload-file-message', err);
        } else {
          fs.writeFile(file, data, function (err) {
            if (err) {
              socket.emit('upload-file-message', err);
            } else {
              const newSharing = new Sharing({
                message: upload.message,
                user_id: upload.user_id,
                file: upload.file.originalname
              });

              newSharing.save().then(sharing => {
                if (sharing) {
                  const response = {
                    code: 200,
                    message: sharing.message,
                    userId: sharing.user_id,
                    file: file,
                  };
                  socket.emit('upload-file-message', response);
                } else {
                  let response = {
                    message: "Error",
                    code: 404
                  };
                  socket.emit('chat-message', response);
                }
              });

            }
          });
        }

      });

    } else {
      const newSharing = new Sharing({
        message: upload.message,
        user_id: upload.user_id
      });

      newSharing.save().then(sharing => {
        if (sharing) {
          const response = {
            message: sharing.message,
            userId: sharing.user_id
          };
          socket.emit('upload-file-message', response);
        } else {
          let response = {
            message: "Error",
            code: 404
          };
          socket.emit('chat-message', response);
        }
      })
    }
  })

  /**
* Delete Sharing
*/

  socket.on("delete-sharing", function (sharing) {
    Sharing.findByIdAndRemove(sharing.sharingId, (err, sharing) => {
      if (err) {
        return res.status(404).json({
          message: err,
          code: 404
        });
      }
      else {
        if (sharing === null) {
          const response = {
            message: "No Room",
            code: 404
          };
          socket.emit('delete-sharing', response);
        }
        const response = {
          code: 200,
          message: "Sharing successfully deleted",
          sharingId: sharing._id
        };
        socket.emit('delete-sharing', response);
      }
    })
  });

  /**
* Add Jaime Sharing
*/

  socket.on("jaime-sharing-add", function (sharing) {
    Sharing.findById(sharing.sharingId, (err, sharing) => {
      if (err) {
        socket.emit('jaime-sharing', 'SERVER', err);
      }
      if (sharing) {
        Sharing.findByIdAndUpdate(sharing._id, { count: sharing.count + 1 }, { new: true }, (err, sharing) => {
          if (err) {
            return res.status(404).json({
              message: err,
              code: 404
            });
          }
          else {
            if (sharing === null) {
              const response = {
                message: "No sharing",
                code: 404
              };
              socket.emit('jaime-sharing', response);
            } else {
              const response = {
                code: 200,
                message: "Sharing successfully updated",
                sharingId: sharing
              };
              socket.emit('jaime-sharing', response);
            }
          }
        })
      }
      else {
        const response = {
          message: "No sharing",
          code: 404
        };
        socket.emit('jaime-sharing', response);
      }

    });
  });

  /**
  * Add Advertising
  */

  socket.on("new-advertising", function (advertising) {
    console.log("message: ", advertising);
    //broadcast message to everyone in port:5000 except yourself.

    const newAdvertising = new Advertising({
      message: advertising.message,
      user_id: advertising.userId
    });

    newAdvertising.save().then(advertising => {
      if (message) {
        let response = {
          message: "Success",
          code: 200,
          advertising: advertising
        };
        socket.emit('advertising-message', response);
      } else {
        let response = {
          message: "Error",
          code: 404
        };
        socket.emit('advertising-message', response);
      }
    });
  });

  /**
  * Add Setting
  */

  socket.on("new-setting", function (settings) {
    console.log("settings: ", settings);
    //broadcast message to everyone in port:5000 except yourself.

    User.findByIdAndUpdate(settings.user_id, { username: settings.name }, { new: true }, (err, user) => {
      if (err) {
        let response = {
          message: "Error",
          code: 404
        };
        socket.emit('setting', response);
      }
      else if (user === null) {
        let response = {
          message: "No User",
          code: 404
        };
        socket.emit('setting', response);
      }
      else {
        Setting.updateOne({user_id:settings.user_id}, { settings }, { new: true }, (err, setting) => {
          if (err) {
            let response = {
              message: "Error",
              code: 404
            };
            socket.emit('setting', response);
          }
          else {
            let response = {
              message: "Success",
              code: 200,
              setting: setting,
              user: user
            };
            socket.emit('setting', response);
          }
        });
      }
    });
  });

  /**
  * Get Setting
  */

  socket.on("get-setting", function (settings) {
    Setting.find({user_id:settings.user_id}, (err, setting) => {
      if (err) {
        let response = {
          message: "No setting",
          code: 404
        };
        socket.emit('setting', response);
      }
      else {
        let response = {
          message: "Success",
          code: 200,
          setting: setting
        };
        socket.emit('setting', response);
      }
    });
  });

  /**
  * Add User To Room
  */
  socket.on('adduser-room', function (username) {
    // store the username in the socket session for this client
    socket.username = username;
    Room.findOne({ 'size': { $not: { $lt: 30 } }, type: 1 }, (err, room) => {
      if (err) {
        socket.emit('addUserToRoom', 'SERVER', err);
      } else if (room === null) {
        socket.emit('addUserToRoom', 'SERVER', 'no room');
      }
      else {
        // store the room name in the socket session for this client
        socket.room = room.name;
        // add the client's username to the global list
        usernames[username] = username;
        // send client to room 1
        socket.join(room.name);

        Room.findByIdAndUpdate(room._id, { size: room.size + 1 }, { new: true }, (err, room) => {
          if (err) {
            socket.emit('addUserToRoom', 'SERVER', err);
          }
        })
        // echo to client they've connected
        socket.emit('addUserToRoom', 'SERVER', 'you have connected to ' + room.name);
        // echo to room 1 that a person has connected to their room
        socket.broadcast.to(room.name).emit('addUserToRoom', 'SERVER', username + ' has connected to this room');
        socket.emit('addUserToRoom', room, room.name);
      }
    })
  });

  /**
  * switchRoom
  */
  socket.on('switchRoom', function (newroom) {
    // leave the current room (stored in session)
    Room.findOne({ 'size': { $not: { $lt: 30 } }, id: newroom.id }, (err, room) => {
      if (err) {
        socket.emit('addUserToRoom', 'SERVER', err);
      } else if (room === null) {
        socket.emit('addUserToRoom', 'SERVER', 'no room');
      }
      else {
        socket.leave(socket.room);
        // join new room, received as function parameter
        socket.join(newroom);
        socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
        // sent message to OLD room
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has left this room');
        // update socket session room title
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
        socket.emit('updaterooms', room, newroom);
      }
    })
  });

  /**
  * Chat private
  */

  socket.on("chat_message-private", function (msg) {
    console.log("message: ", msg);
    //broadcast message to everyone in port:5000 except yourself.
    socket.broadcast.emit("chat-message-private", { message: msg });

    const newMessage = new Message({
      message: msg.message,
      fromUser: msg.fromUser,
      toUser: msg.toUser,
      roomId: msg.roomId
    });

    newMessage.save().then(message => {
      if (message) {
        let response = {
          message: "Success",
          code: 200
        };
        socket.emit('chat-message-private', response);
      } else {
        let response = {
          message: "Error",
          code: 404
        };
        socket.emit('chat-message-private', message);
      }
    });
  });
   /**
  * Chat public
  */

 socket.on("chat_message-public", function (msg) {
  console.log("message: ", msg);
  //broadcast message to everyone in port:5000 except yourself.
  socket.broadcast.emit("chat-message-public", { message: msg });

  const newMessage = new Message({
    message: msg.message,
    fromUser: msg.fromUser,
    toUser: msg.toUser,
    roomId: msg.roomId
  });

  newMessage.save().then(message => {
    if (message) {
      let response = {
        message: "Success",
        code: 200
      };
      socket.emit('chat-message-public', response);
    } else {
      let response = {
        message: "Error",
        code: 404
      };
      socket.emit('chat-message-public', message);
    }
  });
});

  /**
  * Delete Message
  */

  socket.on("delete-message", function (message) {
    Message.findByIdAndRemove(message.messageId, (err, message) => {
      if (err) {
        return res.status(404).json({
          message: err,
          code: 404
        });
      }
      else {
        if (message === null) {
          const response = {
            message: "No message",
            code: 404
          };
          socket.emit('delete-message', response);
        }
        const response = {
          code: 200,
          message: "Message successfully deleted",
          message: message._id
        };
        socket.emit('delete-message', response);
      }
    })
  });


  /**
   * Add Room
   */
  socket.on("new-room", function (room) {

    Room.findOne({
      name: room.name
    }).then(rooms => {
      if (rooms) {
        socket.emit('addRoom', 'Room exist');
      }
      else {

        const newRoom = new Room({
          name: room.name,
          password: room.password,
          type: room.type,
          size: room.size,
          message: room.message,
          user_id: room.user_id
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) socket.emit(err);
          else {
            bcrypt.hash(newRoom.password, salt, (err, hash) => {
              if (err) socket.emit(err);
              else {
                newRoom.password = hash;
                newRoom
                  .save()
                  .then(room => {
                    socket.emit("addRoom", room);
                  });
              }
            });
          }
        });
      }
    })
  })

  /**
  *  User Blocked
  */
  socket.on("user-blocked", function (user_id) {
    User.findByIdAndUpdate(user_id, { isBlocked: 1 }, { new: true }, (err, user) => {
      if (err) {
        let response = {
          message: err,
          code: 404
        };
        socket.emit('userBlocked', response);
      }
      else {
        if (user === null) {
          let response = {
            message: "No User",
            code: 404
          };
          socket.emit('userBlocked', response);
        }
        if (user === null) {
          let response = {
            message: "User Blocked",
            code: 404
          };
          socket.emit('userBlocked', response);
        }
      }
    })
  })

  /**
  *  Private Message
  */
  socket.on("message-private", function (message) {
    Message.find({ fromUser: message.fromUser, toUser: message.toUser }, (err, messages) => {
      if (err) {
        socket.emit('messagePrivate', err);
      }
      else {
        if (messages === null) {
          let response = {
            message: 'No Message',
            code: 404
          };
          socket.emit('messagePrivate', response);
        }
        socket.emit('messagePrivate', messages);
      }
    })
  })

  /**
  *  Public Message
  */

  socket.on("message-public", function (roomId) {
    Message.find({ roomId: roomId }, (err, messages) => {
      if (err) {
        socket.emit('messagePublic', err);
      }
      else {
        if (messages === null) {
          let response = {
            message: 'No Message',
            code: 404
          };
          socket.emit('messagePublic', response);
        }
        socket.emit('messagePublic', messages);
      }
    })
  })

  /**
  * Add User
  */
  socket.on("new-user", function (user) {

    User.findOne({
      username: user.username
    }).then(user => {
      if (user) {
        socket.emit('addUser', "user exist");
      }
      else {
        /*  const avatar = gravatar.url(req.body.email, {
              s: '200',
              r: 'pg',
              d: 'mm'
          });*/
        const newUser = new User({
          username: user.username,
          password: user.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) socket.emit('addUser', err);
          else {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) socket.emit('addUser', err);
              else {
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    socket.emit('addUser', user);
                  });
              }
            });
          }
        });
      }
    });
  })

  /**
   * Get Rooms
   */
  socket.on("get-rooms", function () {
    Room.find((err, rooms) => {
      if (err) {
        socket.emit('getRooms', err);
      }
      else {
        if (rooms === null) {
          socket.emit('getRooms', "No Rooms");
        }
        socket.emit("getRooms", rooms);
      }
    })
  })

  /**
  * Get Users
  */
  socket.on("get-users", function () {
    User.find((err, users) => {
      if (err) {
        socket.emit('getUsers', err);
      }
      else {
        if (users === null) {
          socket.emit('getUsers', "No users");
        }
        socket.emit("getUsers", users);
      }
    })
  })

  /**
  * Users Connected
  */
  socket.on("get-users-connected", function () {
    User.find({ status: 1, isBlocked: 0 }, (err, users) => {
      if (err) {
        socket.emit('getUsersConnected', err);
      }
      else {
        if (users === null) {
          socket.emit('getUsersConnected', "no users");
        } else {
          socket.emit("getUsersConnected", users);
        }
      }
    })
  })


  /**
  * Upload Photo
  */
  socket.on("upload-photo", function (upload) {
    if (upload.image) {
      User.findByIdAndUpdate(upload.userId, { picture: upload.image.originalname }, { new: true }, (err, user) => {
        if (err) {
          socket.emit('upload', err);
        }
        else {
          if (user === null) {
            socket.emit('upload', 'No User');
          } else {
            if (!fs.existsSync("public")) {
              fs.mkdir("public", function (err) {
                if (err) {
                  socket.emit('upload', err);
                }
              });
            }
            if (!fs.existsSync("public/users")) {
              fs.mkdir("public/users", function (err) {
                if (err) {
                  socket.emit('upload', err);
                }
              });
            }
            if (!fs.existsSync("public/users/" + upload.userId)) {
              fs.mkdir("public/users/" + upload.userId, { recursive: true }, function (err) {
                if (err) {
                  socket.emit('upload', err);
                }
              });
            }
            if (!fs.existsSync("public/users/" + upload.userId + "/photo")) {
              fs.mkdir("public/users/" + upload.userId + "/photo", { recursive: true }, function (err) {
                if (err) {
                  socket.emit('upload', err);
                }
              });
            }
            let file = "public/users/" + upload.userId + "/photo/" + upload.image.originalname;
            fs.readFile(image.path, function (err, data) {
              fs.writeFile(file, data, function (err) {
                if (err) {
                  socket.emit('upload', err);
                } else {
                  const response = {
                    message: "Success",
                    id: user._id,
                    photo: file
                  };
                  socket.emit('upload', response);
                }
              });
            });

          }

        }
      })

    }
  })

  /**
    * Upload Photo
    */
  socket.on("upload-photo-room", function (upload) {
    if (upload.image) {
      Room.findByIdAndUpdate(upload.roomId, { picture: upload.image.originalname }, { new: true }, (err, room) => {
        if (err) {
          socket.emit('upload', err);
        }
        else {
          if (room === null) {
            socket.emit('upload', 'No Room');
          } else {
            if (!fs.existsSync("public")) {
              fs.mkdir("public", function (err) {
                if (err) {
                  socket.emit('upload', err);
                }
              });
            }
            if (!fs.existsSync("public/rooms")) {
              fs.mkdir("public/rooms", function (err) {
                if (err) {
                  socket.emit('upload', err);
                }
              });
            }
            if (!fs.existsSync("public/rooms/" + upload.roomId)) {
              fs.mkdir("public/rooms/" + upload.roomId, { recursive: true }, function (err) {
                if (err) {
                  socket.emit('upload', err);
                }
              });
            }
            if (!fs.existsSync("public/rooms/" + upload.roomId + "/photo")) {
              fs.mkdir("public/rooms/" + upload.roomId + "/photo", { recursive: true }, function (err) {
                if (err) {
                  socket.emit('upload', err);
                }
              });
            }
            let file = "public/rooms/" + upload.roomId + "/photo/" + upload.image.originalname;
            fs.readFile(image.path, function (err, data) {
              fs.writeFile(file, data, function (err) {
                if (err) {
                  socket.emit('upload', err);
                } else {
                  const response = {
                    message: "Success",
                    id: roomId,
                    photo: file
                  };
                  socket.emit('upload', response);
                }
              });
            });

          }

        }
      })

    }
  })

  /**
     * Delete Photo
     */
  socket.on("delete-photo", function (upload) {
    if (upload.image) {
      User.findByIdAndUpdate(upload.userId, { picture: '' }, { new: true }, (err, user) => {
        if (err) {
          socket.emit('delete-photo', err);
        } else {
          if (user === null) {
            socket.emit('delete-photo', 'No User');
          } else {
            let file = "public/rooms/" + upload.userId + "/photo/" + upload.imageName;

            fs.unlink(file, (err) => {
              if (err) {
                socket.emit('delete-photo', err);
              } else {
                socket.emit('delete-photo', 'Photo deleted');
              }
            })
          }
        }
      })
    } else {
      socket.emit('delete-photo', 'error');
    }
  })
  /**
  * Socket Disconnect
  */
  socket.on("disconnect", () => console.log("Client disconnected"));

});
server.listen(PORT);
