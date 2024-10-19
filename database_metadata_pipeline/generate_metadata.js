// Load the full build.
const async = require("async")
const {getDBSchema} = require("../db_op/db_op");

// get database schema
function getDatabaseSchema() {}
/*
// generate auto relations
function getColumnMatch(columnList, col, clb) {
  async.filter(columnList, (col, clb) => {

  }, (err, rslt) => {

  });
}
function generateRelations() {
  // forEach column check for another column with same name in a different table
  async.each(columnList, (col, clb) => {
    getColumnMatch(columnList, col, (err, rslt) => {
      clb(err, rslt);
    })
  }, (err, clb) => {

  });
}
*/
// generate meta data
function generateMetaData() {}

// send to output
function dbMeta(databaseName, finalClb) {
  async.waterfall(
    [
      function (callback) {
        // get database schema
        getDBSchema("health4all", (err, rslt) => {
          callback(err, rslt);
        });
      },
      /*
      function (dbList, callback) {
        // generateRelations
      },
      function (dbList, callback) {
        // write to database
      },
      */
    ],
    (err, rslt) => {
      if (err) {
        console.log("There was an error");
        finalClb(true, { error: "Some error occurred" });
      } else {
        console.log("Got the result");
        finalClb(false, { result: rslt });
      }
    }
  );
}

module.exports = dbMeta;