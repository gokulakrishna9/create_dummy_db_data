const mysql = require('mysql');
const myc_pool = function (datb = '') {
  return mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: datb,
    port: 3308,
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

module.exports = myc_pool;