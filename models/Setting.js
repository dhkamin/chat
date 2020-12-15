const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SettingSchema = new Schema({
    sizeText: {
        type: Number,
        default: 100
    },

    user_id: {
        type: String,
        required: true
    },
    colorText: {
        type: String,
        default: "#000000"
    },

    backgrounColor: {
        type: String,
        default: "#000000"
    },

    colorName: {
        type: String,
        default: "#000000"
    },
    etat: {
        type: String,
    }

});

const Setting = mongoose.model('setting', SettingSchema);

module.exports = Setting;
