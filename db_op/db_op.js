const knex = require("../db_op/connection_pool_sql_to_application");

exports.getDBSchema = function (dbName, callback) {
  knex
    .raw("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ?", [
      dbName,
    ])
    .then((rslt) => {      
      console.log('Got Knex Result');
      console.log(rslt[0][100]);      
      callback(null, rslt[0]);
    });
};