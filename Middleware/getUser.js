const jwt = require("jsonwebtoken");

const secret_key = process.env.JWT_SECRET_KEY;

const getUser = (req, res, next) => {

    const jwtoken = req.header("jwtoken");
    if (!jwtoken) {
        return res.status(400).json({ error: true, message: "Use the Valid Token" })
    }
    try {
        const userId = jwt.verify(jwtoken, secret_key);
        req.userId = userId.user;
        next();
    }
    catch (error) {
        return res.status(400).json({ error: true, message: error })
    }

}

module.exports = getUser;