// register.js

const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    data.username = !isEmpty(data.username) ? data.username : '';

    data.password = !isEmpty(data.password) ? data.password : '';

    if (!Validator.isLength(data.username, { min: 3, max: 30 })) {
        errors.username = 'username must be between 2 to 30 chars';
    }

    if (Validator.isEmpty(data.username)) {
        errors.username = 'username field is required';
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must have 6 chars';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }




    return {
        errors,
        isValid: isEmpty(errors)
    }
}
