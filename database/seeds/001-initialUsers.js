
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { username: 'Autumn', password: 'password' },
        { username: 'Summer', password: 'password' },
        { username: 'Spring', password: 'password' }
      ]);
    });
};
