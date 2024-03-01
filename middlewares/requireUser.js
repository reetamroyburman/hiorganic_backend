const jwt = require("jsonwebtoken");
const {sellerProfile} = require("../models/Schema");

const requireUser = require("../middlewares/requireUser");

module.exports = async (req, res, next) => {
    if (
        !req.headers ||
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer")
    ) {
        return res.status(401).send("Authorization header is required");
    }

    const accessToken = req.headers.authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_PRIVATE_KEY
        );
        req._id = decoded._id;
        
        const user = await sellerProfile.findById(req._id);

        if(!user) {
        return res.status(401).send("User not found");
        }

        next();
    } catch (e) {
        console.log(e);
        return res.status(401).send("Invalid access key");
    }
};