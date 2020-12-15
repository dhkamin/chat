const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DEFAULT_USER_PICTURE = "/img/user.jpg";
const RoomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
     
    user_id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },
    
    type: {
        type: String,
    },

    size: {
        type: Number
    },
    
    message: {
        type: String,
        required: true
    },

    status: {
        type: Number,
        default: 0
    },
    picture: { type: String, default: DEFAULT_USER_PICTURE },
    connections: { type: [{ userId: String, socketId: String }]}
});

const Room = mongoose.model('rooms', RoomSchema);

module.exports = Room;
