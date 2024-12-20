// Load the full build.
const async = require("async");
const { getDBSchema } = require("../db_op/db_op");
const { columnRelation } = require("../util/string_functions");
const knex = require("../db_op/connection_pool_sql_to_application");
const {
  combinePropertyValues,
  arrayOfObjectsToObjectOfObjects,
} = require("../util/list_functions");
//const knexCDDD = require("../db_op/connection_pool_sql_to_application");
/**
 {"TABLE_CATALOG":"def","TABLE_SCHEMA":"health4all","TABLE_NAME":"activity_done","COLUMN_NAME":"activity_done_id","ORDINAL_POSITION":1,"COLUMN_DEFAULT":null,"IS_NULLABLE":"NO","DATA_TYPE":"int","CHARACTER_MAXIMUM_LENGTH":null,"CHARACTER_OCTET_LENGTH":null,"NUMERIC_PRECISION":10,"NUMERIC_SCALE":0,"DATETIME_PRECISION":null,"CHARACTER_SET_NAME":null,"COLLATION_NAME":null,"COLUMN_TYPE":"int","COLUMN_KEY":"PRI","EXTRA":"auto_increment","PRIVILEGES":"select,insert,update,references","COLUMN_COMMENT":"","GENERATION_EXPRESSION":"","SRS_ID":null,"relatedTo":[]},
*/

// generate auto relations
function getColumnMatch(columnList, colRoot, clbMain) {
  async.map(
    columnList,
    (col, clb) => {
      if (columnRelation(colRoot, col)) {
        clb(null, col);
      } else {
        clb(null, {});
      }
    },
    (err, colList) => {
      // Add the logic for direction of relation
      async.filter(
        colList,
        (col, clb) => {
          if (Object.keys(col).length === 0) {
            clb(null, false);
          } else {
            clb(null, true);
          }
        },
        (err, colLst) => {
          colLst = colLst.map((col) => {
            return {
              column_name: col.COLUMN_NAME,
              table_name: col.TABLE_NAME,
              table_schema: col.TABLE_SCHEMA,
              data_type: col.DATA_TYPE,
              column_key: col.COLUMN_KEY,
            };
          });
          clbMain(null, { ...colRoot, related_to: colLst });
        }
      );
    }
  );
}
function generateRelations(columnList, clbMain) {
  // forEach column check for another column with same name in a different table
  async.map(
    columnList,
    (col, clb) => {
      getColumnMatch(columnList, col, (err, relatedColumnList) => {
        clb(null, relatedColumnList);
      });
    },
    (err, relatedColumnList) => {
      clbMain(null, relatedColumnList);
    }
  );
}
/**
 {"TABLE_SCHEMA":"health4all","TABLE_NAME":"activity_done","COLUMN_NAME":"activity_done_id","COLUMN_DEFAULT":null,"IS_NULLABLE":"NO","DATA_TYPE":"int","CHARACTER_MAXIMUM_LENGTH":null,"NUMERIC_PRECISION":10,"NUMERIC_SCALE":0,"COLUMN_TYPE":"int","COLUMN_KEY":"PRI","EXTRA":"auto_increment","relatedTo":[]},
*/
// generate meta data
function reduceColumnFeatureSize(colList, clbMain) {
  async.map(
    colList,
    (col, clb) => {
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
        related_to: col.related_to,
      };
      clb(null, colF);
    },
    (err, colList) => {
      clbMain(null, colList);
    }
  );
}

function writeToDB(columnList, finalClb) {
  console.log("Write To Database");
  console.log(columnList.length);
  console.log(columnList[0].table_schema);
  async.waterfall(
    [
      function (callback) {
        // create database record
        knex("database_meta")
          .insert({ database_name: columnList[0].table_schema })
          .then((rslt) => {
            callback(null, {
              database_id: rslt[0],
              database_name: columnList[0].table_schema,
            });
          });
      },
      function (databaseObject, callback) {
        // Get unique table names
        let uniqueTableName = [
          ...new Set(columnList.map((db) => db.table_name)),
        ];
        // Add db ID to the list
        // create table records
        uniqueTableName = uniqueTableName.map((tn) => {
          return { database_id: databaseObject.database_id, table_name: tn };
        });
        // Bulk insert --> NOT GETTING IDs as array in mysql --> LATER
        async.map(
          uniqueTableName,
          (tbr, clb) => {
            knex("table_meta")
              .insert(tbr)
              .then((tableID) => {
                clb(null, {
                  table_name: tbr.table_name,
                  table_id: tableID[0],
                  database_id: databaseObject.database_name,
                });
              });
          },
          (err, tableList) => {
            // Map the table array to table Object
            tableList = arrayOfObjectsToObjectOfObjects(
              tableList,
              "table_name"
            );
            callback(null, tableList);
          }
        );
      },
      function (tableList, callback) {
        async.map(
          columnList,
          (col, clb) => {
            let table = tableList[col.table_name];
            let colR = {
              ...col,
              table_id: table.table_id,
              database_id: table.database_id,
            };
            delete colR.related_to;
            delete colR.table_name;
            delete colR.table_schema;
            knex("column_meta")
              .insert(colR)
              .then((columnID) => {
                let propertyValue = combinePropertyValues(col, [
                  "column_name",
                  "table_id",
                ]);
                clb(null, {
                  ...col,
                  column_id: columnID[0],
                });
              });
          },
          (err, columnList) => {
            console.log("Column List");
            columnList = arrayOfObjectsToObjectOfObjects(columnList, [
              "column_name",
              "table_name",
              "table_schema",
            ]);
            callback(null, columnList);
          }
        );
      },
      function (columnList, callback) {
        // create relation records
        // for each column in column list find relation column
        async.map(
          columnList,
          (col, colLClb) => {
            if (col.related_to.length == 0) {
              colLClb(null, { ...col, related_to: [] });
              return;
            }
            /*relation_meta: relation_meta_id, column_one_id, column_two_id, relation_type_id */
            async.map(
              col.related_to,
              (rt, crClb) => {
                let rtColPrp = combinePropertyValues(rt, [
                  "column_name",
                  "table_name",
                  "table_schema",
                ]);
                let relatedCol = columnList[rtColPrp];
                knex("relation_meta")
                  .insert({
                    column_one_id: col.column_id,
                    column_two_id: relatedCol.column_id,
                  })
                  .then((relationID) => {
                    crClb(null, {
                      relation_id: relationID[0],
                      ...rt,
                    });
                  });
              },
              (err, crelList) => {
                colLClb(null, { ...col, related_to: crelList });
              }
            );
          },
          (err, columnList) => {
            console.log("Column with relation");
            console.log(columnList);
            callback(null, columnList);
          }
        );
      },
    ],
    (err, columnList) => {
      finalClb(null, columnList);
    }
  );
}

// db, table, col, relation
// send to output
function dbMeta(databaseName, finalClb) {
  async.waterfall(
    [
      function (callback) {
        // get database schema
        getDBSchema("health4all", (err, columnList) => {
          callback(err, columnList);
        });
      },
      function (columnList, callback) {
        generateRelations(columnList, (err, columnListRelation) => {
          console.log("DB Relation List - Working fine");
          //console.log(columnListRelation);
          callback(err, columnListRelation);
        });
      },
      function (dbRelationMapping, callback) {
        // reduce the columns
        reduceColumnFeatureSize(dbRelationMapping, (err, colList) => {
          console.log("Reduced Column List - Works fine");
          //console.log(colList.length);
          callback(null, colList);
        });
      },
      ///*
      function (colList, callback) {
        // write to database
        writeToDB(colList, (err, rslt) => callback(err, rslt));
      },
      //*/
    ],
    (err, rslt) => {
      if (err) {
        console.log("There was an error! Before returning to browser");
        finalClb(true, { error: "Some error occurred" });
      } else {
        console.log("Got the result");
        finalClb(false, rslt);
      }
    }
  );
}

module.exports = dbMeta;

// https://knexjs.org/guide/
// https://hiddentao.github.io/squel/
// https://www.prisma.io/dataguide/database-tools/top-nodejs-orms-query-builders-and-database-libraries
