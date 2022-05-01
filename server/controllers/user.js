const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Area = require("../models/area");
require("dotenv").config();

const { empty_validator, error, isInvalidZone, isInvalidArea, createUser, isEmailAlreadyTaken, isPasswordMatch, getUser, signin_validator, getOfficial } = require("../util/validator");

exports.signup = async (req, res, next) => {
    const { fName, lName,  email, password, mno, zone, area } = req.body;

    const errors = {
        "fName": "", 
        "lName": "",
        "email": "",
        "password": "",
        "mno": "",
        "zone": "",
        "area": ""
    };

    try {
        // Validating if there is any empty fields
        let newErrors = empty_validator(req.body, errors);
        let empty = false;
        for (const [key, value] of Object.entries(newErrors)) {
            if(value !== '') {
                empty = true;
                break;
            }
        }
        if(empty) {
            const emptyError = error("Validation failed", newErrors, 500);
            throw emptyError;
        }

        // Validating the email
        if(!email.trim().includes("@")) {
            const emailError = error("Invalid email", { ...errors, email: "Invalid email" }, 500);
            throw emailError;
        }

        // Validating the password
        if(password.trim().length < 6) {
            const passwordError = error("Password must be 6 characters long", { ...errors, password: "Password must be 6 characters long" }, 500);
            throw passwordError;
        }

        // Validating mobile number
        if(mno.length !== 10) {
            const mobileError = error("Mobile Number must be 10 digits", { ...errors, mno: "Mobile Number must be 10 digits" }, 500);
            throw mobileError;
        }

        // Validating Zone
        if(await isInvalidZone(zone)) {
            const zoneError = error("A Invalid zone", { ...errors, zone: "Invalid zone" }, 500);
            throw zoneError;
        }
        // Validating Area
        if(await isInvalidArea(zone, area)) {
            const areaError = error("Invalid area", { ...errors, area: "Invalid area" }, 500);
            throw areaError;
        }

        if(await isEmailAlreadyTaken(email)) {
            const emailError = error("Email is Already in use", { ...errors, email: "Email is Already in use" }, 500);
            throw emailError;
        }

        // hash password
        req.body.password = await bcrypt.hash(password, 12);

        // creating user
        const user = await createUser(req.body);
        // console.log(user);

        // creating token
        const token = jwt.sign({email: user.email}, process.env.JWT_TOKEN, { expiresIn: '1w' });

        // getting user's area
        let userArea = await Area.findByPk(user.AreaId);

        return res.status(200).json({
            message: "User created successfully...",
            data: {
                id: user.id,
                fName: user.fName,
                lName: user.lName,
                email: user.email,
                mno: user.mno,
                isVerified: user.isVerified,
                area: userArea.name,
                type: "user"
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
    // console.log(req.body);
    const { email, password } = req.body;

    let errors = { "email": "", "password": "" };
    try {
        // Validating if there is any empty fields
        let newErrors = signin_validator(req.body, errors);
        let empty = false;
        for (const [key, value] of Object.entries(newErrors)) {
            if(value !== '') {
                empty = true;
                break;
            }
        }
        if(empty) {
            const emptyError = error("Validation failed", errors, 500);
            throw emptyError;
        }

        // Validating the email
        if(!email.trim().includes("@")) {
            const emailError = error("Invalid email", { email: "Invalid email" }, 500);
            throw emailError;
        }

        // 1. Official
        // checking whether the credential belongs to official's
        const official = await getOfficial(email);
        if(official) {
            // Check password match
            if(!(await isPasswordMatch(official.password, password))) {
                const passwordError = error("Password doesn't match", { password: "Password doesn't match" }, 500);
                throw passwordError;
            }

            // creating token
            const token = jwt.sign({email: official.email}, process.env.JWT_TOKEN, { expiresIn: '1w' });
            
            return res.status(200).json({
                message: "Official logged in successfully...",
                data: {
                    id: official.id,
                    fName: official.fName,
                    lName: official.lName,
                    email: official.email,
                    mno: official.mno,
                    isVerified: 1,
                    type: "official"
                },
                token: token
            });
        }

        // 2. User
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
        const token = jwt.sign({email: user.email}, process.env.JWT_TOKEN, { expiresIn: '1w' });
        
        // getting user's area
        const area = await Area.findByPk(user.AreaId);

        return res.status(200).json({
            message: "User logged in successfully...",
            data: {
                id: user.id,
                fName: user.fName,
                lName: user.lName,
                email: user.email,
                mno: user.mno,
                isVerified: user.isVerified,
                area: area.name,
                type: "user"
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
