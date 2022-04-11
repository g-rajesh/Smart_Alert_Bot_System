
const SignIn = (req, res, app) => {
    console.log(req.body)
    console.log('res', res)
    res.send(req.body)
}

module.exports = {
    SignIn
}