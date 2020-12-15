const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 0
    },
    fromUser: {
        type: String
    },
    toUser: {
        type: String
    },

    roomId: { type: String }
});

const Message = mongoose.model('messages', MessageSchema);

module.exports = Message;
