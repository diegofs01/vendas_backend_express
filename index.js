require('dotenv-safe').config();
let jwt = require('jsonwebtoken');
let http = require('http');
const express = require('express');
const app = express();
let cors = require('cors');
let cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
    cors({
        origin: true,
        credentials: true,
        methods: 'GET,POST,PUT,DELETE',
        optionsSuccessStatus: 200,
    })
);

app.use(require('./routes/jwt').router);
app.use(require('./routes/cliente'));
app.use(require('./routes/produto'));
app.use(require('./routes/venda'));

app.get('/', (req, res, next) => {
    res.json({message:'Tudo certo!'});
});

let server = http.createServer(app);
server.listen(8080);
console.log("Servidor rodando na porta 8080...");