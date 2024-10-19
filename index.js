const express = require('express')
const app = express()
const port = 3000

const indexRouter = require('./route/index');
const database = require('./route/databaseConnectionConfiguration');
const metaData = require('./route/dbRelationMapping');

app.use('/', indexRouter);
app.use('/database', database);
app.use('/meta_data', metaData);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});