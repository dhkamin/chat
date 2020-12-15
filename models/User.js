const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DEFAULT_USER_PICTURE = "/img/user.jpg";
const UserSchema = new Schema({
    username: {
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
    status: {
        type: Number,
        default: 0
    },

    type: {
        type: String,
        default: 'user'
    }
    ,
    isVisible: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    picture: { type: String, default: DEFAULT_USER_PICTURE }
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
