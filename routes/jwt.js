let router = require('express').Router();
let jwt = require('jsonwebtoken');

router.post('/login', (req, res, next) => {
    if(req.body.user === 'diego' && req.body.pwd === 'diego123') {
        const id = 1;   
        let token = jwt.sign({id}, process.env.SECRET, {
            expiresIn: 1800
        });
        return res.json({auth: true, token: token});
    }

    res.status(500).json({message:'Login inválido'});
});

router.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
});

const verifyJWT = (req, res, next) => {
    let token = req.headers['Authorization'];

    console.log('Token: ' + token);

    if(token.startsWith("Bearer ")) {
        token = token.substring(7);
    }

    if(!token) return res.status(401).json({auth: false, message: 'No token provided.'});

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if(err) return res.status(500).json({auth: false, message: 'Failed to authenticate token.'});

        req.userId = decoded.id;
        next();
    });
}

module.exports.router = router;
module.exports.verifyJWT = verifyJWT;