require('dotenv-safe').config();
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import { urlencoded, json } from 'body-parser';

app.use(urlencoded({extended: true}));
app.use(json());
app.use(cookieParser());

app.use(require('./routes/jwt').router);
app.use(require('./routes/cliente'));
app.use(require('./routes/produto'));
app.use(require('./routes/venda'));

app.get('/', (req, res, next) => {
    res.json({message:'Tudo certo!'});
});

app.use(
    cors({
        origin: true,
        credentials: true,
        methods: 'GET,POST,PUT,DELETE',
        optionsSuccessStatus: 200,
        allowedHeaders: ['Content-Type'],
    })
);

let server = createServer(app);
server.listen(3000);
console.log("Servidor rodando na porta 3000...");