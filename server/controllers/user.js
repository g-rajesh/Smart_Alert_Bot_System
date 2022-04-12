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

const fireApp = initializeApp(firebaseConfig);
 const auth = getAuth(fireApp);



exports.signup = (req, res, next) => {
    console.log(req.body);

    return res.status(200).json(req.body);
};
  
exports.signin = (req, res, next) => {
    console.log(req.body);

    return res.status(200).json(req.body);
};

req = {
    body: {
        email: 'sivavignesh761@gmail.com',
        password: 'siva@123',
        uid: 'fD6RE27es8QYgizbhAkWrdRbHi93'
    }
}

async function signup(req) {
    let email = req.body.email
    let password = req.body.email
    await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;
        await sendEmailVerification(auth.currentUser)
                .then()
                .catch(err => console.log('send email verify err: ', err))
        // console.log('access token: ', user.stsTokenManager.accessToken, '\n')
        // console.log('refresh token: ', user.stsTokenManager.refreshToken, '\n\n')
        console.log('signned up!... Verification email send')
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`signup error code: ${errorCode}, err msg: ${errorMessage}`)
    });
}

async function signin() {
    let email = req.body.email
    let password = req.body.password
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // console.log('access token: ', user.stsTokenManager.accessToken, '\n')
            // console.log('refresh token: ', user.stsTokenManager.refreshToken, '\n\n')
            console.log('signned in!')

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`signin error code: ${errorCode}, err msg: ${errorMessage}`)
            
        });
}



// signup()
// signin()
