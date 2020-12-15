// register.js

const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.message = !isEmpty(data.message) ? data.message : '';
    
    /**
     * Message
     */

    if (!Validator.isLength(data.message, { min: 1, max: 500 })) {
        errors.message = 'Message must be between 1 to 500 chars';
    }

    if (Validator.isEmpty(data.message)) {
        errors.message = 'Message field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
