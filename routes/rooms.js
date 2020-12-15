const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const validateRoomInput = require('../validation/rooms');
const Room = require('../models/Rooms');

/**
 * Get All Rooms
 */

router.get('/rooms', passport.authenticate('jwt', { session: false }), (req, res) => {

    Room.find((err, rooms) => {
        if (err) {
            return res.status(404).json({
                message: 'No Found',
                code: 404
            });
        }
        else {
            if (rooms === null) {
                return res.status(404).json({
                    message: 'No Rooms',
                    code: 404
                });
            }
            return res.status(200).json(rooms);
        }
    })
})

/**
 * Get Room By Id
 */
router.get('/room/:roomId', passport.authenticate('jwt', { session: false }), (req, res) => {

    Room.findById(req.params.roomId, (err, room) => {
        if (err) {
            return res.status(404).json({
                message: err,
                code: 404
            });
        }
        else {
            if (room === null) {
                return res.status(404).json({
                    message: "No Room",
                    code: 404
                });
            }
            return res.status(200).json(room);
        }
    })
})
/**
 * Add Room
 */
router.post('/room', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.body)
    const { errors, isValid } = validateRoomInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    Room.findOne({
        name: req.body.name
    }).then(room => {
        if (room) {
            return res.status(400).json({
                name: 'room already exists',
                code: 400
            });
        }
        else {
            /*  const avatar = gravatar.url(req.body.email, {
                  s: '200',
                  r: 'pg',
                  d: 'mm'
              });*/
            const newRoom = new Room({
                name: req.body.name,
                password: req.body.password,
                type: req.body.type,
                size: req.body.size,
                message: req.body.message,
                user_id: req.user.id
            });

            bcrypt.genSalt(10, (err, salt) => {
                if (err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newRoom.password, salt, (err, hash) => {
                        if (err) console.error('There was an error', err);
                        else {
                            newRoom.password = hash;
                            newRoom
                                .save()
                                .then(room => {
                                    res.json(room)
                                });
                        }
                    });
                }
            });
        }
    })
})
/**
 * Update Room
 */
router.put('/room/:roomId', passport.authenticate('jwt', { session: false }), (req, res) => {

    Room.findByIdAndUpdate(req.params.roomId, req.body, { new: true }, (err, room) => {
        if (err) {
            return res.status(404).json({
                message: err,
                code: 404
            });
        }
        else {
            if (room === null) {
                return res.status(404).json({
                    message: "No Room",
                    code: 404
                });
            }
            return res.status(200).json(room);
        }
    })
})
/**
 * Delete Room
 */
router.delete('/room/:roomId', passport.authenticate('jwt', { session: false }), (req, res) => {

    Room.findByIdAndRemove(req.params.roomId, (err, room) => {
        if (err) {
            return res.status(404).json({
                message: err,
                code: 404
            });
        }
        else {
            if (room === null) {
                return res.status(404).json({
                    message: "No Room",
                    code: 404
                });
            }
            const response = {
                message: "Room successfully deleted",
                id: room._id
            };
            return res.status(200).json(response);
        }
    })
})

module.exports = router;