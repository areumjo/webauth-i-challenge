const bcrypt = require('bcryptjs');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { username: 'Autumn', password: bcrypt.hashSync('password', 8) },
        { username: 'Summer', password: bcrypt.hashSync('password', 8) },
        { username: 'Spring', password: bcrypt.hashSync('password', 8) }
      ]);
    });
};
