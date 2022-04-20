const { initializeApp } = require("firebase/app");
require("dotenv").config();

const {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } = require('firebase/auth');

const apiKey = process.env.API_KEY;
const authDomain = process.env.AUTH_DOMAIN;
const databaseURL = process.env.DATABASE_URL;
const projectId = process.env.PROJECT_ID;
const storageBucket = process.env.STORAGE_BUCKET;
const messagingSenderId = process.env.MESSAGING_SENDER_ID;
const appId = process.env.APP_ID;
const measurementId = process.env.MEASUREMENT_ID;

const firebaseConfig = {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId
};

initializeApp(firebaseConfig);
const auth = getAuth();

exports.sendVerificationEmail = async (email, password) => {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(user, { url: "http://localhost:3000/" })

        return user.emailVerified;
    } catch(e) {
        console.log(e);
    }
}

exports.isEmailVerified = async (email, password) => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);

        return user.emailVerified;
    } catch(e) {
        console.log(e);
    }
}
