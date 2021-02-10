const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log(req.headers)
        let decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'RANDOM_TOKEN_SECRET');
        if (decoded.id) {
            req.params.id = decoded.id;
            next();
        }
        else {
            throw 'Not Authorized';
        }
    }
    catch {
        res.status(401).json({ message: 'Not Authorized' })
    }
};
