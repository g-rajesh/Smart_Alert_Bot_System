const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");

    try {
        if (!authHeader) {
            const error = new Error("Not authenticated!");
            error.status = 401;
            throw error;
        }

        const token = authHeader.split(" ")[1];
        let decodedToken;

        decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

        if (!decodedToken) {
            const error = new Error("Not authenticated!");
            error.status = 401;
            throw error;
        }

        req.email = decodedToken.email;

        next();

    } catch(err) {       

        console.log(err); 
        
        if(!err.status) err.status = 500;
        if(err.message === "jwt expired") {
            err.message = "Token Expired";
            err.status = 401;
            err.data = { error: "JWT token Expired" };
        }
        next(err);
    }
};