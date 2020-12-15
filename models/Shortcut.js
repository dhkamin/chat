const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShortcutSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String
    }
});

const Shortcut = mongoose.model('shortcut', ShortcutSchema);

module.exports = Shortcut;
