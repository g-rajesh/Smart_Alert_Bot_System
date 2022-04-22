const bcrypt = require("bcryptjs");

const Zone = require("../models/zone");
const Area = require("../models/area");
const User = require("../models/user");
const { sendVerificationEmail } = require("./firebase");
const { async } = require("@firebase/util");
const Official = require("../models/official");


exports.empty_validator = (data, errors) => {    
    
    const list = {
        "fName": "First Name", 
        "lName": "Last Name",
        "email": "Email",
        "password": "Password",
        "mno": "Mobile Number",
        "zone": "Zone",
        "area": "Area"
    };

    for (const [key, value] of Object.entries(data)) {
        if(value == '') {
            errors[key] = list[key] + " is required";
        }
    }

    return errors;
}

exports.signin_validator = (data, errors) => {
    const list = {
        "email": "Email",
        "password": "Password"
    };

    for (const [key, value] of Object.entries(data)) {
        if(value == '') {
            errors[key] = list[key] + " is required";
        }
    }

    return errors;
}

exports.error = (e, data, status) => {
    const err = new Error(e);
    err.data = data;
    err.status = status;
    return err;
}

exports.isInvalidZone = async (zone) => {
    const res = await Zone.findOne({ where: { name: zone } });
    return res == null;
}

exports.isInvalidArea = async (zone, area) => {
    const zone1 = await Zone.findOne({ where: { name: zone } });
    const area1 = await Area.findOne({ where: { name: area, ZoneId: zone1.id } });

    return area1 == null;
}

exports.isEmailAlreadyTaken = async (email) => {
    const official = await Official.findOne({ where: { email } });
    const user = await User.findOne({ where: { email } });
    return user != null || official != null;
}

exports.createUser = async (data) => {
    data.isVerified = false;
    const area = await Area.findOne({ where: { name: data.area } });
    data.AreaId = area.id;
    
    const user = await User.create(data);
    await user.save();

    const isVerified = await sendVerificationEmail(user.email, user.password);

    return user;
}

exports.getOfficial = async (email) => {
    return await Official.findOne({ where: { email } });
}

exports.getUser = async (email) => {
    return await User.findOne({ where: { email } });
}

exports.isPasswordMatch = async (hashed, password) => {
    const isEqual = await bcrypt.compare(password, hashed);

    console.log(isEqual);
    return isEqual;
}
