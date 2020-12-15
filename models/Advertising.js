const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdvertisingSchema = new Schema({
    message: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: String
    }
});

const Advertising = mongoose.model('advertising', AdvertisingSchema);

module.exports = Advertising;
