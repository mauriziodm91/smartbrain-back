const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex')

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
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res)=>{
    res.json(database.users);
})

app.post('/signin', (req, res)=>{
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
    } else{
        res.status(400).json("error logging in");
    }
})

app.post('/register', (req, res)=>{

    const {email, name, password} = req.body;

    // bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash(password, salt, function(err, hash) {
    //         // Store hash in your password DB.
    //         console.log(hash);
    //     });
    // });

    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        }).then(user => {
            res.json(user[0])
        })
        .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res)=>{
    const {id} = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            if (user.length){
                res.json(user[0])
            } else{
                res.status(400).json('Not Found')
            }
        })
        .catch(err => res.status(400).json('error getting user'));
})

app.put('/image', (req,res)=>{
    const {id} = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries =>{
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'))
});

app.listen(3000, ()=>{
    console.log('app is running con port 3000');
});