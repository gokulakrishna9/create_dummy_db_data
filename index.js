const express = require('express')
const app = express()
const port = 3000

const indexRouter = require('./route/index');

app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});