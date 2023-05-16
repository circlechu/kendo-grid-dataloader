
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import * as api from './include/api.js';

const upload = multer();
const app = express();
const port = 3001;


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(upload.array());

app.use(cors({origin: '*'}));

app.options("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

app.get('/', (req, res) => {
    res.send('Mock API');
});


app.get('/api/getData', api.getData);

app.listen(port, () => console.log(`
Api service listening on port ${port}!
http://localhost:3001/
`))