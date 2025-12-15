const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Get the token from the header
    const token = req.header('Authorization');

    // 2. Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // 3. Verify the token
        // The frontend sends "Bearer <token>", so we split to get the actual token part
        const actualToken = token.split(" ")[1];
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        // 4. Add user data to the request object so our controllers can use it
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};