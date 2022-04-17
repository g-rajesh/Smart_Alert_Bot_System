const { initializeApp } = require("firebase/app")
const {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } = require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyBbnxiHXC6qghq0J7rsX9TEF2z_hazlfrc",
    authDomain: "smart-alert-bot-sytem.firebaseapp.com",
    databaseURL: "https://smart-alert-bot-sytem-default-rtdb.firebaseio.com",
    projectId: "smart-alert-bot-sytem",
    storageBucket: "smart-alert-bot-sytem.appspot.com",
    messagingSenderId: "301888177188",
    appId: "1:301888177188:web:33d58986bec223641744b1",
    measurementId: "G-9JTT1N99MN"
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

        console.log(user.emailVerified);
        return user.emailVerified;
    } catch(e) {
        console.log(e);
    }
}
