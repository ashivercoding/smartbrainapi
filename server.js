import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

import {handleRegister} from  './controllers/register.js';
import {handleSignin} from './controllers/signin.js';
import {handleProfile} from './controllers/profile.js';
import {handleImage, handleApiCall } from './controllers/image.js';

const db = knex({
    client: 'pg',
    connection: {
        connectionnString: process.env.DATABASE_URL,
        host: process.env.DATABASE_HOST,
        port: 5432,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PW,
        database: process.env.DATABASE_DB
    }
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('success')
})
app.post('/signin', (req, res) => { handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { handleProfile(req, res, db)} )
app.post('/imageurl', (req, res) => { handleApiCall(res, req)});
app.put('/image', (req, res) => handleImage(req, res, db))


app.listen(5432, ()=> {
    console.log('app is running on port 3000')
})
