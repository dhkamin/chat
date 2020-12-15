const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const validateMessageInput = require('../validation/shortcut');
const Shortcut = require('../models/Shortcut');

/**
 * Add Shortcut
 */
router.post('/shortcut', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateMessageInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    else {
        const newShortcut = new Shortcut({
            name: req.body.name,
            type: req.body.type
        });


        newShortcut
            .save()
            .then(shortcut => {
                res.json(shortcut)
            });
    }
})


module.exports = router;