const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserAgentSchema = new Schema({
    family: {
        type: String
    },
    major: {
        type: String
    },
    minor: {
        type: String
    },
    patch: {
        type: String
    },
    source: {
        type: String
    },
    user_id: { type: String }
});

const UserAgent = mongoose.model('user_agent', UserAgentSchema);

module.exports = UserAgent;
