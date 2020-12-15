const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const validateMessageInput = require('../validation/message');
const Message = require('../models/Message');

/**
 * Get All Message
 */

router.get('/messages', passport.authenticate('jwt', { session: false }), (req, res) => {

    Message.find((err, messages) => {
        if (err) {
            return res.status(404).json({
                message: 'No Found',
                code: 404
            });
        }
        else {
            if (messages === null) {
                return res.status(404).json({
                    message: 'No Message',
                    code: 404
                });
            }
            return res.status(200).json(messages);
        }
    })
})

/**
 * Get All Message In Room 'Public Tchat'
 */
router.get('/message-room', passport.authenticate('jwt', { session: false }), (req, res) => {

    Message.find({ fromUser: req.user.id,roomId: req.body.roomId },(err, messages) => {
        if (err) {
            return res.status(404).json({
                message: 'No Found',
                code: 404
            });
        }
        else {
            if (messages === null) {
                return res.status(404).json({
                    message: 'No Message',
                    code: 404
                });
            }
            return res.status(200).json(messages);
        }
    })
})

/**
 * Get All Message User to User 'private Tchat'
 */
router.get('/message-user', passport.authenticate('jwt', { session: false }), (req, res) => {

    Message.find({ fromUser: req.user.id,toUser: req.query.toUser },(err, messages) => {
        if (err) {
            return res.status(404).json({
                message: 'No Found',
                code: 404
            });
        }
        else {
            if (messages === null) {
                return res.status(404).json({
                    message: 'No Message',
                    code: 404
                });
            }
            return res.status(200).json(messages);
        }
    })
})

/**
 * Add Message
 */
router.post('/message', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateMessageInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    else {
        /*  const avatar = gravatar.url(req.body.email, {
              s: '200',
              r: 'pg',
              d: 'mm'
          });*/
        const newMessage = new Message({
            message: req.body.message,
           fromUser: req.user.id ,
           toUser: req.body.toUser ,
           roomId: req.body.roomId 
        });


        newMessage
            .save()
            .then(message => {
                res.json(message)
            });
    }
})


module.exports = router;