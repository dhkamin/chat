const express = require('express');
const app = express()
const http = require('http')
const server = http.Server(app)
const socketIo = require("socket.io")
const io = socketIo(server);

const Users = require('./../models/User');
const Rooms = require('./../models/Rooms');
const Messages = require('./../models/Message');

/**
 * Socket Io
 */
module.exports =  io.on("connection", socket => {
    console.log('Client Connected', socket.id);

    /**
   * Add User To Room
   */
    socket.on('adduser-room', function (username) {
        // store the username in the socket session for this client
        socket.username = username;
        Rooms.findOne({ 'size': { $not: { $lt: 30 } } }, (err, room) => {
            if (err) {
                socket.emit('updatechat', 'SERVER', err);
            } else if (room === null) {
                socket.emit('updatechat', 'SERVER', 'no room');
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
                        socket.emit('updatechat', 'SERVER', err);
                    }
                })
                // echo to client they've connected
                socket.emit('updatechat', 'SERVER', 'you have connected to ' + room.name);
                // echo to room 1 that a person has connected to their room
                socket.broadcast.to(room.name).emit('updatechat', 'SERVER', username + ' has connected to this room');
                socket.emit('updaterooms', room, room.name);
            }
        })
    });

    /**
   * Chat
   */
    socket.on("chat message", function (msg) {
        console.log("message: " + msg);
        //broadcast message to everyone in port:5000 except yourself.
        socket.broadcast.emit("received", { message: msg });
        const { errors, isValid } = validateMessageInput(req.body);

        if (!isValid) {
            socket.emit(errors);
        }
        else {

            const newMessage = new Messages({
                message: msg.message,

                connectionsUsers: [{ fromUser: msg.user_id }],

                roomId: msg.roomId
            });

            newMessage.save();
        }
    });

    /**
     * Add Room
     */
    socket.on("new-room", function (room) {
        const { errors, isValid } = validateRoomInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }
        Rooms.findOne({
            name: room.name
        }).then(room => {
            if (room) {
                return res.status(400).json({
                    name: 'room already exists',
                    code: 400
                });
            }
            else {

                const newRoom = new Room({
                    name: room.name,
                    password: room.password,
                    type: room.type,
                    size: room.size,
                    message: room.message,
                    user_id: room.id
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
                                        socket.emit("new rooms", room);
                                    });
                            }
                        });
                    }
                });
            }
        })
    })

    socket.on("user.blocked", function (user) {
        User.findByIdAndUpdate(user.user_id, { isBlocked: 1 }, { new: true }, (err, user) => {
            if (err) {
                let response = {
                    message: err,
                    code: 404
                };
                socket.emit(response);
            }
            else {
                if (user === null) {
                    let response = {
                        message: "No User",
                        code: 404
                    };
                    socket.emit(response);
                }
                if (user === null) {
                    let response = {
                        message: "User Blocked",
                        code: 404
                    };
                    socket.emit(response);
                }
            }
        })
    })
    /**
   * Add User
   */
    socket.on("new-user", function (user) {
        const { errors, isValid } = validateRegisterInput(req.body);

        if (!isValid) {
            socket.emit(errors);
        }
        Users.findOne({
            username: user.username
        }).then(user => {
            if (user) {
                socket.emit("user exist");
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
                    if (err) socket.emit(err);
                    else {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) socket.emit(err);
                            else {
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        socket.emit("user", user);
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
    socket.on("get-rooms", function (socket) {
        Rooms.find((err, rooms) => {
            if (err) {
                socket.emit(err);
            }
            else {
                if (rooms === null) {
                    socket.emit("No users");
                }
                socket.emit("list rooms", rooms);
            }
        })
    })

    /**
   * Get Users
   */
    socket.on("get-users", function (socket) {
        Users.find((err, users) => {
            if (err) {
                socket.emit(err);
            }
            else {
                if (users === null) {
                    socket.emit("No users");
                }
                socket.emit("list users", users);
            }
        })
    })

    /**
   * Users Connected
   */
    socket.on("get-users-connected", function (socket) {
        Users.find({ status: 1, isBlocked: 0 }, (err, users) => {
            if (err) {
                socket.emit(err);
            }
            else {
                if (users === null) {
                    socket.emit("no users");
                } else {
                    socket.emit("list users connecteed", users);
                }
            }
        })
    })

    /**
   * Socket Disconnect
   */
    socket.on("disconnect", () => console.log("Client disconnected"));

});