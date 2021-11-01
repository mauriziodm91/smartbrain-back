const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const signin = require('./controllers/signin');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'tobi',
      database : 'smartbrain'
    }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res)=>{
    res.send('success');
})

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db ,bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) =>{profile.handleProfile(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(3000, ()=>{
    console.log('app is running con port 3000');
});