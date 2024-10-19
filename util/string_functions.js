const v = require('voca');

const stringCompare = function(stringOne, stringTwo) {
  stringOne = v.replaceAll(stringOne, /[^\w\s]/gi, '');
  stringOne = v.lowerCase(stringOne);
  stringTwo = v.replaceAll(stringTwo, /[^\w\s]/gi, '');
  stringTwo = v.lowerCase(stringTwo);
  if(stringOne === stringTwo) {
    return true;
  } else {
    return false;
  }
}
exports.strCompare = stringCompare
exports.columnRelation = function(columnOne, columnTwo) {
  if(!stringCompare(columnOne.TABLE_SCHEMA, columnTwo.TABLE_SCHEMA)) {
    return false;
  }
  if(stringCompare(columnOne.TABLE_NAME, columnTwo.TABLE_NAME)) {
    return false;
  }
  if(stringCompare(columnOne.COLUMN_NAME, columnTwo.COLUMN_NAME) && stringCompare(columnOne.DATA_TYPE, columnTwo.DATA_TYPE)) {
    return true;
  }
}