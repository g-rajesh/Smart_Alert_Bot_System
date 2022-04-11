var express = require('express')
const exp_app = express()
const signin = './Controllers/Signin'
const signup = './Controllers/Signup'


const { initializeApp } = require("firebase/app")
const firebaseConfig = {
  apiKey: "AIzaSyBbnxiHXC6qghq0J7rsX9TEF2z_hazlfrc",
  authDomain: "smart-alert-bot-sytem.firebaseapp.com",
  projectId: "smart-alert-bot-sytem",
  storageBucket: "smart-alert-bot-sytem.appspot.com",
  messagingSenderId: "301888177188",
  appId: "1:301888177188:web:33d58986bec223641744b1",
  measurementId: "G-9JTT1N99MN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

exp_app.use(express.json());

exp_app.post('/tneb-mit/api/signin', (req, res) => {
    console.log(req.body)
    res.send(req.body)
})

exp_app.post('/tneb_mit/api/signup', (req, res) => {
    signup.SignUp(req, res, app)
})

exp_app.listen(8080, () => {
    console.log('server listening on port 8080')
})