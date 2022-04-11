exports.signup = (req, res, next) => {
    console.log(req.body);

    return res.status(200).json(req.body);
};
  
exports.signin = (req, res, next) => {
    console.log(req.body);

    return res.status(200).json(req.body);
};
