let async = require('async');
let _ = require('lodash');
let myc_pool = require('./connection_pool_sql_to_application');
let connectionPool = myc_pool('code_writer');

exports.getDatabaseList = function (callback) {
  console.log('Get DB List.');
  connectionPool.getConnection((err, connection) => {
    connection.query('SHOW DATABASES', (error, result, fields) => {
      connection.release();
      if (error) {
        console.log('Error! In SHOW DATABASES');
        callback(error, null);
      } else {
        result = _.map(result, (rs) => { return rs.Database; });
        result = _.filter(result, (rs) => {
          return !(rs == 'information_schema' || rs == 'mysql'
         || rs == 'performance_schema' || rs == 'sys' || rs == 'code_writer');
        });
        callback(null, result);
      }
    });
  });
};

exports.getDBSchema = function (dbName, callback) {
  console.log('DB Name');
  console.log(dbName);
  myc_pool().getConnection((err, connection) => {
    connection.query('SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = "' + dbName + '"', (error, result, fields) => {
      if (error) {
        rslt['error'] = error;
        callback(error, null);
        return;
      }
      //let rslt = { db_name: db_name, columns: result };
      callback(null, result);
    });
    connection.release();
  });
}

function queryR(query, clbk) {
  connectionPool.getConnection((err, connection) => {
    if (err) {
      console.log('Error! Unable to Get Connection.');
      console.log(err);
      clbk(err, null);
    } else {
      connection.query(query, function (error, result, fields) {
        connection.release();
        if (error) {
          console.log('Error! Unable to get data.');
          console.log(error);
          console.log(this.sql);
        } else {
          clbk(null, result);
        }
      });
    }
  });
}

function queryW(sql, value_array, aclb) {
  myc_pool().getConnection((err, connection) => {
    if (err) {
      console.log('Error! Unable to Get Connection.');
      console.log(err);
    } else {
      connection.query(sql, value_array, function (error, result, fields) {
        connection.release();
        if (error) {
          console.log('Error! INSERT/UPATE PROPERTY.')
          console.log(error);
        } else {
          aclb(null, {
            insert_id: result.insertId
          });
        }
      });
    }
  });
}

exports.queryR = queryR;
exports.queryW = queryW;