const mysql = require('mysql');
const myc_pool = function (datb = '') {
  return mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: datb,
    port: 3306,
    connectionLimit: 2500,
    queueLimit: 15000
    /*
    waitForConnections: true,
    queueLimit: 15000,
    connectionLimit: 2500,
    
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    //*/
  })
};

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
});

module.exports = myc_pool;
module.exports = knex