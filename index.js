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

app.use(require('./routes/jwt').router);
app.use(require('./routes/cliente'));
app.use(require('./routes/produto'));

app.get('/', (req, res, next) => {
    res.json({message:'Tudo certo!'});
});

let server = http.createServer(app);
server.listen(3000);
console.log("Servidor rodando na porta 3000...");