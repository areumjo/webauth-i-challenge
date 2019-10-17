const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  Users.add({ username, password: bcrypt.hashSync(password, 8) })
      .then(saved => {
          res.status(201).json({ message: "User registered", saved });
      })
      .catch(err => {
          res.status(500).json({ message: "Error registering user" });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
      .first()
      .then(user => {
          if (user && bcrypt.compareSync(password, user.password)) {
              res.status(200).json({ message: `Welcome ${user.username}!, now you have a cookie` });
          } else {
              res.status(401).json({ message: 'Invalid Credentials' });
          }
      })
      .catch(error => {
          res.status(500).json(error);
      });
});

// for logout === delete the session
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json({
          message: "you can checkout but you can't leave"
        });
      } else {
        res.end();
      }
    })
  }
});

module.exports = router;