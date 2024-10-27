function combinePropertyValues(objectC, genericPropertyName) {
  if (Array.isArray(genericPropertyName) == true) {
    let propV = genericPropertyName.map((pn) => {
      return objectC[pn];
    }).join('---');
    return propV;
  } else {
    return objectC[genericPropertyName];
  }
}

function arrayOfObjectsToObjectOfObjects(arrayList, genericPropertyName) {
  return arrayList.reduce((fnlObj, ae) => {
    let valueProperty = combinePropertyValues(ae, genericPropertyName);
    return { [valueProperty]: ae, ...fnlObj };
  }, {});
}

exports.arrayOfObjectsToObjectOfObjects = arrayOfObjectsToObjectOfObjects;
exports.combinePropertyValues = combinePropertyValues;
