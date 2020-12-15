const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SharingSchema = new Schema({
    
    user_id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    
    message: {
        type: String,
    },

    file: {
        type: String,
    },

    count: {
        type: Number,
        default: 0
    }

});

const Sharing = mongoose.model('sharing', SharingSchema);

module.exports = Sharing;
