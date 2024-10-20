const express = require("express");
const router = express.Router();
const dbMeta = require("../database_metadata_pipeline/generate_metadata");

// keep the UI simple
router.get("/get_database_meta", function (req, res, next) {
  dbMeta("", (err, rslt) => {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        rslt
      })
    );
  });
});

// get database
router.get("/get_database_list", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      connectionList: ["Database One", "Database Two", "Database Three"],
    })
  );
});

// get tables
router.get("/get_table_list", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      connectionList: ["Table One", "Table Two", "Table Three"],
    })
  );
});

// get columns
router.get("/get_column_list", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      connectionList: ["Column One", "Column Two", "Column Three"],
    })
  );
});

// get table relations
router.get("/get_relation_list", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      connectionList: ["Relation One", "Relation Two", "Relation Three"],
    })
  );
});

// add database
router.post("/add_database", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      connectionList: ["Database One", "Database Two", "Database Three"],
    })
  );
});

// add table relation
router.get("/add_relation", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      connectionList: ["Relation One", "Relation Two", "Relation Three"],
    })
  );
});

module.exports = router;
