module.exports = function requireRole(role) {
    return function (req, res, next) {
        console.log(req.session.role)
        if (req.session.user && req.session.role === role) {
            next();
        } else {
            return res.status(403).json('Forbidden');
        }
    }
}