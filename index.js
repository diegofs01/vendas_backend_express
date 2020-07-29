require('dotenv-safe').config();
let jwt = require('jsonwebtoken');
let http = require('http');
const express = require('express');
const app = express();
let cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

//<autenticação>
app.post('/login', (req, res, next) => {
    if(req.body.user === 'diego' && req.body.pwd === 'diego123') {
        const id = 1;   
        let token = jwt.sign({id}, process.env.SECRET, {
            expiresIn: 300
        });
        return res.json({auth: true, token: token});
    }

    res.status(500).json({message:'Login inválido'});
});

app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
});

function verifyJWT(req, res, next) {
    let token = req.headers['x-access-token'];
    if(!token) return res.status(401).json({auth: false, message: 'No token provided.'});

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if(err) return res.status(500).json({auth: false, message: 'Failed to authenticate token.'});

        req.userId = decoded.id;
        next();
    });
}
//</autenticação>


app.get('/', (req, res, next) => {
    res.json({message:'Tudo certo!'});
});

app.get('/clientes', verifyJWT, (req, res, next) => {
    res.json([{id:1, nome:'Diego'}, {id:2, nome:'Peralta'}]);
});

let server = http.createServer(app);
server.listen(3000);
console.log("Servidor rodando na porta 3000...");