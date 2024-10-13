const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ indexRouter: 'Welcome!' }));
});

module.exports = router;