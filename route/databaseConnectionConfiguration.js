const express = require("express");
const router = express.Router();

router.get("/get_connection_list", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      connectionList: ["Connection One", "Connection Two", "Connection Three"],
    })
  );
});

router.post("/add_connection_configuration", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ postedConnection: ["Connection Posted"] }));
});

router.post("/update_connection_configuration", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ postedConnection: ["Connection Updated"] }));
});

router.get("/delete_connections", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      connectionList: ["Connection One", "Connection Two", "Connection Three"],
    })
  );
});

router.get("/get_connection", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      connectionList: ["Connection One", "Connection Two", "Connection Three"],
    })
  );
});
module.exports = router;