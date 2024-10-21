function combinePropertyValues(objectC, genericPropertyName) {
  if (Array.isArray(genericPropertyName) == true) {
    let propV = genericPropertyName.map((pn) => {
      return objectC[pn];
    }).join('_');
    return propV;
  } else {
    return objectC[pn];
  }
}

function arrayOfObjectsToObjectOfObjects(arrayList, genericPropertyName) {
  return arrayList.map((ae) => {
    let valueProperty = combinePropertyValues(ae, genericPropertyName);
    return { [valueProperty]: ae };
  });
}

module.exports = arrayOfObjectsToObjectOfObjects;
module.exports = combinePropertyValues;
