// register.js

const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    
    /**
     * Message
     */

    if (!Validator.isLength(data.name, { min: 1, max: 30 })) {
        errors.name = 'Shortcut must be between 1 to 500 chars';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Shortcut field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
