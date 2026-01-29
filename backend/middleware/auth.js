const jwt = require('jsonwebtoken');

//Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    try {
        //Get token from Authorization header
        const token = req.headers.authorization?.split(' ')[1]; 

        if(!token){
            return res.status(401).json({error: 'No token provided'});
        }

        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({error: 'Invalid token', details: err.message});
    }
};

module.exports = {verifyToken};