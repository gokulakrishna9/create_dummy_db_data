const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'code_writer',
  },
  pool: { min: 0, max: 7 },
  debug: false,
  log: {
    warn(message) {},
    error(message) {},
    deprecate(message) {},
    debug(message) {},
  },
});

module.exports = knex