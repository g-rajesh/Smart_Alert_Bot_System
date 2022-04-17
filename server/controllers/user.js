const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { empty_validator, error, isInvalidZone, isInvalidArea, createUser, isEmailAlreadyTaken, isPasswordMatch, getUser } = require("../util/validator");

exports.signup = async (req, res, next) => {
    const { firstName, lastName,  email, password, mobileNumber, zone, area } = req.body;

    let errors;
    try {
        // Validating if there is any empty fields
        errors = empty_validator(req.body);
        if(Object.keys(errors).length != 0) {
            const emptyError = error("Validation failed", errors, 500);
            throw emptyError;
        }

        // Validating the email
        if(!email.trim().includes("@")) {
            const emailError = error("Invalid email", { email: "Invalid email" }, 500);
            throw emailError;
        }

        // Validating the password
        if(password.trim().length < 6) {
            const passwordError = error("Password must be 6 characters long", { password: "Password must be 6 characters long" }, 500);
            throw passwordError;
        }

        // Validating mobile number
        if(mobileNumber.length < 10 || mobileNumber.length > 10) {
            const mobileError = error("Mobile Number must be 10 digits", { mobileNumber: "Mobile Number must be 10 digits" }, 500);
            throw mobileError;
        }

        // Validating Zone
        if(await isInvalidZone(zone)) {
            const zoneError = error("A Invalid zone", { zone: "Invalid zone" }, 500);
            throw zoneError;
        }
        // Validating Area
        if(await isInvalidArea(zone, area)) {
            const areaError = error("Invalid area", { area: "Invalid area" }, 500);
            throw areaError;
        }

        if(await isEmailAlreadyTaken(email)) {
            const emailError = error("Email is Already in use", { email: "Email is Already in use" }, 500);
            throw emailError;
        }

        // hash password
        req.body.password = await bcrypt.hash(password, 12);

        // creating user
        const user = await createUser(req.body);
        console.log(user);

        // creating token
        const token = jwt.sign({email: user.email}, "TEAM_TNEB", { expiresIn: '1w' });

        return res.status(200).json({
            message: "User created successfully...",
            user: { 
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobileNumber: user.mobileNumber,
                isVerified: user.isVerified
            },
            token: token
        });
    } catch(e) {
        if (!e.status) {
            e.status = 500;
        }
        next(e);
    }    
}

exports.signin = async (req, res, next) => {
    const { email, password } = req.body;

    let errors;
    try {
        // Validating if there is any empty fields
        errors = empty_validator(req.body);
        if(Object.keys(errors).length != 0) {
            const emptyError = error("Validation failed", errors, 500);
            throw emptyError;
        }

        // Validating the email
        if(!email.trim().includes("@")) {
            const emailError = error("Invalid email", { email: "Invalid email" }, 500);
            throw emailError;
        }

        // getting user from db
        const user = await getUser(email);

        // Check email exist in the database
        if(!user) {
            const emailError = error("Email doesn't exist", { email: "Email doesn't exist" }, 500);
            throw emailError;
        }

        // Check password match
        if(!(await isPasswordMatch(user.password, password))) {
            const passwordError = error("Password doesn't match", { password: "Password doesn't match" }, 500);
            throw passwordError;
        }

        // creating token
        const token = jwt.sign({email: user.email}, "TEAM_TNEB", { expiresIn: '1w' });

        return res.status(200).json({
            message: "User logged in successfully...",
            user: { 
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobileNumber: user.mobileNumber,
                isVerified: user.isVerified
            },
            token: token
        });

    } catch(e) {
        if (!e.status) {
            e.status = 500;
        }
        next(e);
    }
}
