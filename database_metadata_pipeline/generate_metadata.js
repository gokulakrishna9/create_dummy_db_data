// Load the full build.
const async = require("async")
const {getDBSchema} = require("../db_op/db_op");
const {columnRelation} = require("../util/string_functions");

/**
 {"TABLE_CATALOG":"def","TABLE_SCHEMA":"health4all","TABLE_NAME":"activity_done","COLUMN_NAME":"activity_done_id","ORDINAL_POSITION":1,"COLUMN_DEFAULT":null,"IS_NULLABLE":"NO","DATA_TYPE":"int","CHARACTER_MAXIMUM_LENGTH":null,"CHARACTER_OCTET_LENGTH":null,"NUMERIC_PRECISION":10,"NUMERIC_SCALE":0,"DATETIME_PRECISION":null,"CHARACTER_SET_NAME":null,"COLLATION_NAME":null,"COLUMN_TYPE":"int","COLUMN_KEY":"PRI","EXTRA":"auto_increment","PRIVILEGES":"select,insert,update,references","COLUMN_COMMENT":"","GENERATION_EXPRESSION":"","SRS_ID":null,"relatedTo":[]},
*/

// generate auto relations
function getColumnMatch(columnList, colRoot, clbMain) {
  async.map(columnList, (col, clb) => {
    if(columnRelation(colRoot, col)) {
      console.log(colRoot.COLUMN_NAME + ' ' + colRoot.COLUMN_NAME);
      console.log(col.DATA_TYPE + ' ' + col.DATA_TYPE);
      clb(null, col);
    } else {
      clb(null, {});
    }
  }, (err, colList) => {
    // Add the logic for direction of relation
    async.filter(colList, (col, clb) => {
      if(Object.keys(col).length === 0) {
        clb(null, false);
      } else {
        clb(null, true);
      }
    }, (err, colLst) => {
      colLst = colLst.map((col) => {
        return {
          column_name: col.COLUMN_NAME, table_name: col.TABLE_NAME, table_schema: col.TABLE_SCHEMA,
          data_type: col.DATA_TYPE, column_key: col.COLUMN_KEY
        }
      });
      clbMain(null, {...colRoot, related_to: colLst});
    })
    
  });
}
function generateRelations(columnList, clbMain) {
  // forEach column check for another column with same name in a different table
  async.map(columnList, (col, clb) => {
    getColumnMatch(columnList, col, (err, relatedColumnList) => {
      clb(null, relatedColumnList);
    })
  }, (err, relatedColumnList) => {
    clbMain(null, relatedColumnList);
  });
}
    /**
 {"TABLE_SCHEMA":"health4all","TABLE_NAME":"activity_done","COLUMN_NAME":"activity_done_id","COLUMN_DEFAULT":null,"IS_NULLABLE":"NO","DATA_TYPE":"int","CHARACTER_MAXIMUM_LENGTH":null,"NUMERIC_PRECISION":10,"NUMERIC_SCALE":0,"COLUMN_TYPE":"int","COLUMN_KEY":"PRI","EXTRA":"auto_increment","relatedTo":[]},
*/
// generate meta data
function reduceColumnFeatureSize(colList, clbMain) {
  async.map(colList, (col, clb) => {
    let colF = {
      table_schema: col.TABLE_SCHEMA,
      table_name: col.TABLE_NAME,
      column_name: col.COLUMN_NAME,
      column_default: col.COLUMN_DEFAULT,
      is_nullable: col.IS_NULLABLE,
      data_type: col.DATA_TYPE,
      character_maximum_length: col.CHARACTER_MAXIMUM_LENGTH,
      numeric_precision: col.NUMERIC_PRECISION,
      numeric_scale: col.NUMERIC_SCALE,
      column_type: col.COLUMN_TYPE,
      column_key: col.COLUMN_KEY,
      extra: col.EXTRA,
      related_to: col.related_to
    }
    clb(null, colF);
  }, (err, colList) => {
    clbMain(null, colList);
  })
}
// db, table, col, relation
// send to output
function dbMeta(databaseName, finalClb) {
  async.waterfall(
    [
      function (callback) {
        // get database schema
        getDBSchema("health4all", (err, dbList) => {
          callback(err, dbList);
        });
      },
      function (dbList, callback) {        
        generateRelations(dbList, (err, dbListRelation) => {
          callback(err, dbListRelation);
        });        
      },
      function(dbRelationMapping, callback) {
        // reduce the columns
        reduceColumnFeatureSize(dbRelationMapping, (err, colList) => {
          callback(null, colList);
        })
      }
      /*
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
        finalClb(false, rslt);
      }
    }
  );
}

module.exports = dbMeta;