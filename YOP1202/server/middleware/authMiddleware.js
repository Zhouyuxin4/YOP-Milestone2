const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    //const token = req.header('Authorization')?.split(' ')[1];
    const token = req.cookies.authToken;
    console.log(token);

    //if the request doesn't contain a token
    if (!token) return res.status(403).json({ message: 'Access denied.' });
    //if the request contains a token
    try {
        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId }; //assign the decoded user id to the request
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
    }
}; 
