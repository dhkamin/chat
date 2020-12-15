// register.js

const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    
    data.name = !isEmpty(data.name) ? data.name : '';

    data.password = !isEmpty(data.password) ? data.password : '';

    data.message = !isEmpty(data.message) ? data.message : '';
/**
 * Size
 */
    if(!Validator.isNumeric(data.size)) {
        errors.name = 'Size Is a Number';
    }
/**
 * Name
 */

if(!Validator.isLength(data.name, { min: 5, max: 50 })) {
    errors.name = 'Name must be between 5 to 50 chars';
}
    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    /**
 * Type
 */

if(!Validator.isLength(data.type, { min: 5, max: 50 })) {
    errors.type = 'type must be between 5 to 50 chars';
}
    if(Validator.isEmpty(data.type)) {
        errors.type = 'type field is required';
    }

    /**
 * Message
 */
if(!Validator.isLength(data.message, { min: 5, max: 50 })) {
    errors.message = 'Message must be between 5 to 50 chars';
}
  
    if(Validator.isEmpty(data.message)) {
        errors.message = 'Message is required';
    }

/**
 * Password
 */

if(!Validator.isLength(data.password, {min: 6, max: 30})) {
    errors.password = 'Password must have 6 chars';
}

if(Validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
}
    return {
        errors,
        isValid: isEmpty(errors)
    }
}
