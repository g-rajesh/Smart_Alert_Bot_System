var { initializeApp } = require("firebase/app")
var {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } = require('firebase/auth')

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

exports.signup = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(user, { url: "http://localhost:3000/" })
        console.log(user.emailVerified);

        return res.status(200).json({ user });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}

exports.signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        console.log(user.emailVerified);

        return res.status(200).json({ user });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
    
}
