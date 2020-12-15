const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: '/tmp/' });
const User = require('../models/User');
const UserAgent = require('../models/user_agent');
const useragent = require('useragent');

/**
 * User Agent
 */

router.get("/user-agent", (req, res) => {
    var agent = useragent.parse(req.headers['user-agent']);
    console.log(agent)
    const newUserAgent = new UserAgent({
        family: agent.family,
        major: agent.major,
        minor: agent.minor,
        patch: agent.patch,
        source: agent.source
    });
    newUserAgent
        .save()
        .then(userAgent => {
            res.status(200).json(userAgent)
        });
});

/**
 * Get Users Agent
 */

router.get("/user-agent-list", (req, res) => {
    UserAgent.find((err, users) => {
        if (err) {
            return res.status(404).json({
                message: 'No Founf',
                code: 404
            });
        }
        else {
            if (users === null) {
                return res.status(404).json({
                    message: 'No Users',
                    code: 404
                });
            } else {
                return res.status(200).json(users);
            }

        }
    })
});

/**
 * Get All User
 */
router.get('/users', (req, res) => {
    console.log("kslfksdklfklsdflkkl");
    User.find((err, users) => {
        console.log("kslfksdklfklsdflkkl");
        if (err) {
            return res.status(404).json({
                message: 'No Founf',
                code: 404
            });
        }
        else {
            if (users === null) {
                return res.status(404).json({
                    message: 'No Users',
                    code: 404
                });
            } else {
                console.log(users);
                return res.status(200).json(users);
            }

        }
    })
})

/**
 * Get All User Connected
 */
router.get('/users-conected', (req, res) => {
    User.find({ status: 1 }, (err, users) => {
        if (err) {
            return res.status(404).json({
                message: 'No Founf',
                code: 404
            });
        }
        else {
            if (users === null) {
                return res.status(404).json({
                    message: 'No Users',
                    code: 404
                });
            } else {
                console.log(users);
                return res.status(200).json(users);

            }

        }
    })
})
/**
 * Add User
 */
router.post('/user', (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({
        username: req.body.username
    }).then(user => {
        if (user) {
            return res.status(400).json({
                username: 'username already exists'
            });
        }
        else {
            /*  const avatar = gravatar.url(req.body.email, {
                  s: '200',
                  r: 'pg',
                  d: 'mm'
              });*/
            const newUser = new User({
                username: req.body.username,
                password: req.body.password,
            });

            bcrypt.genSalt(10, (err, salt) => {
                if (err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) console.error('There was an error', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user)
                                });
                        }
                    });
                }
            });
        }
    });
});

/**
 * Logout User
 */

router.get("/logout", (req, res) => {
    req.logout();
    User.findByIdAndUpdate(req.user.id, { status: 0 }, { new: true }, (err, user) => {
        if (err) {
            return res.status(404).json({
                message: err,
                code: 404
            });
        }
        else {

            // destroy session data
            req.session = null;
            return res.status(200).json(true);
        }
    })
});

/**
 * Blocked User
 */

router.post("/user-blocked", (req, res) => {
    UserAgent.find({source:req.query.source}, (err, userAgent) => {
        if(err){
            return res.status(404).json({
                message: err,
                code: 404
            });
        } if (userAgent === null) {
            return res.status(404).json({
                message: "No User Agent",
                code: 404
            });
        }else{
            console.log(userAgent)
            User.findByIdAndUpdate(userAgent[0].user_id, { isBlocked: 1 }, { new: true }, (err, user) => {
                if (err) {
                    return res.status(404).json({
                        message: err,
                        code: 404
                    });
                }
                else {
                    if (user === null) {
                        return res.status(404).json({
                            message: "No User",
                            code: 404
                        });
                    }
                    const response = {
                        message: "User Blocked",
                        id: user._id
                    };
                    return res.status(200).json(response);
                }
            })
        }
    
    })
});

/**
 * Login User
 */
router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    var agent = useragent.parse(req.headers['user-agent']);
    console.log(agent)
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username })
        .then(user => {
            if (!user) {
                errors.username = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        User.findByIdAndUpdate(user.id, { status: 1, isVisible: req.body.isVisible }, { new: true }, (err, user) => {
                            if (err) {
                                return res.status(404).json({
                                    message: err,
                                    code: 404
                                });
                            }
                            else {

                                const payload = {
                                    id: user.id,
                                    username: user.username,
                                }
                                req.session.role = user.type;
                                jwt.sign(payload, 'secret', {
                                    expiresIn: 3600
                                }, (err, token) => {
                                    if (err) console.error('There is some error in token', err);
                                    else {
                                        if (user === null) {

                                            return res.status(404).json({
                                                message: "No User",
                                                code: 404
                                            });
                                        }
                                        console.log(user.id)
                                        UserAgent.findOneAndUpdate({ source: agent.source }, { user_id: user.id }, { new: true }, (err, userAgent) => {
                                            if (err) {
                                                return res.status(404).json({
                                                    message: err,
                                                    code: 404
                                                });
                                            }

                                            else {
                                                res.json({
                                                    code: 200,
                                                    success: true,
                                                    token: `Bearer ${token}`,
                                                    user: user
                                                });
                                            }
                                        })

                                    }
                                });
                            }
                        })

                    }
                    else {
                        errors.password = 'Incorrect Password';
                        return res.status(400).json(errors);
                    }
                });
        });
});

/**
 * Guest User
 */
router.post('/guestuser', (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({
        username: req.body.username
    }).then(user => {
        if (user) {
            return res.status(400).json({
                username: 'username already exists'
            });
        }
        else {
            /*  const avatar = gravatar.url(req.body.email, {
             s: '200',
             r: 'pg',
             d: 'mm'
             });*/
            const newUser = new User({
                username: req.body.username,
            })
            newUser.save().then(user => { res.json(user) });


        }
    });

});
/**
 * Get User By Id
 */
router.get('/user/:uid', passport.authenticate('jwt', { session: false }), (req, res) => {

    User.findById(req.params.userId, (err, user) => {
        if (err) {
            return res.status(404).json({
                message: err,
                code: 404
            });
        }
        else {
            if (user === null) {
                return res.status(404).json({
                    message: "No User",
                    code: 404
                });
            } else {
                user.picture = req.headers.host + `/public/users/${req.params.userId}/photo/${user.picture}`
                return res.status(200).json(user);
            }
        }
    })
})

/**
 * Get User Auth
 */
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        id: req.user.id,
        username: req.user.username,
        type: req.user.type,
        status: req.user.status,
        isVisible: req.user.isVisible,
        picture: req.headers.host + `/public/users/${req.user.id}/photo/${req.user.picture}`
    });
});

/**
 * Update User
 */

router.put('/user/:uid', passport.authenticate('jwt', { session: false }), (req, res) => {

    User.findByIdAndUpdate(req.params.userId, req.body, { new: true }, (err, user) => {
        if (err) {
            return res.status(404).json({
                message: err,
                code: 404
            });
        }
        else {
            if (user === null) {
                return res.status(404).json({
                    message: "No User",
                    code: 404
                });
            }
            return res.status(200).json(user);
        }
    })
})

/**
 * Delete User
 */

router.delete('/user/:uid', passport.authenticate('jwt', { session: false }), (req, res) => {

    User.findByIdAndRemove(req.params.userId, (err, user) => {
        if (err) {
            return res.status(404).json({
                message: err,
                code: 404
            });
        }
        else {
            if (user === null) {
                return res.status(404).json({
                    message: "No User",
                    code: 404
                });
            }
            const response = {
                message: "User successfully deleted",
                id: user._id
            };
            return res.status(200).json(response);
        }
    })
})
/**
 * Upload Image
 */

router.post("/user/:userId/photo", upload.single('image'), (req, res) => {

    let image = req.file;

    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(image.originalname)) {

        return res.status(500).json({ code: 500, message: "image not valid" });
    }
    if (image) {
        User.findByIdAndUpdate(req.params.userId, { picture: image.originalname }, { new: true }, (err, user) => {
            if (err) {
                return res.status(404).json({
                    message: err,
                    code: 404
                });
            }
            else {
                if (user === null) {
                    return res.status(404).json({
                        message: "No User",
                        code: 404
                    });
                } else {
                    if (!fs.existsSync("public")) {
                        fs.mkdir("public", function (err) {
                            if (err) {
                                return res.status(500).json({ code: 500, message: err });
                            }
                        });
                    }
                    if (!fs.existsSync("public/users")) {
                        fs.mkdir("public/users", function (err) {
                            if (err) {
                                return res.status(500).json({ code: 500, message: err });
                            }
                        });
                    }
                    if (!fs.existsSync("public/users/" + req.params.userId)) {
                        fs.mkdir("public/users/" + req.params.userId, { recursive: true }, function (err) {
                            if (err) {
                                return res.status(500).json({ code: 500, message: err });
                            }
                        });
                    }
                    if (!fs.existsSync("public/users/" + req.params.userId + "/photo")) {
                        fs.mkdir("public/users/" + req.params.userId + "/photo", { recursive: true }, function (err) {
                            if (err) {
                                return res.status(500).json({ code: 500, message: err });
                            }
                        });
                    }
                    let file = "public/users/" + req.params.userId + "/photo/" + image.originalname;
                    fs.readFile(image.path, function (err, data) {
                        fs.writeFile(file, data, function (err) {
                            if (err) {
                                return res.status(404).json({ code: 404, message: err });
                            } else {
                                const response = {
                                    message: "Success",
                                    id: user._id
                                };
                                return res.status(200).json(response);
                            }
                        });
                    });

                }

            }
        })

    }
});

module.exports = router;
