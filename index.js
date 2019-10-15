const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');
const Users = require('./users/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send("It's alive!");
});

server.get('/users', (req, res) => {
    Users.find()
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            res.status(500).json({
            message: "unexected error" })
        })
})

server.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    Users.add({ username, password: bcrypt.hashSync(password, 8) })
        .then(saved => {
            res.status(201).json({ message: "User registered", saved });
        })
        .catch(err => {
            res.status(500).json({ message: "Error registering user" });
    });
});
  
server.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});
  
server.get('/api/users', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});
  
// middleware
function restricted(req, res, next) {
    const { username, password } = req.headers;
  
    if (username && password) {
        Users.findBy({ username })
            .first()
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    next();
                } else {
                    res.status(401).json({ message: "Invalid credentials" });
                }
            })
            .catch(err => {
                res.status(500).json({ message: "unexected error" })
            })
    } else {
        res.status(400).json({ message: "please provide username and password"});
    }
};

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
