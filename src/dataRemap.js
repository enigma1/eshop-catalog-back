// Array iterator map to client
const dbIterators = {
  "find": {
    "_id": "id"
  }
};

// Couch response map to client
const dbResponse = {
  "find": {
    "docs": "items"
  },
  "doc-id": {
    "_id": "id"
  }
}

// Remap routine from db to web response
export const remap = (data, type) => {
  const map = dbResponse[type]
  if(!map) return data;

  const iterator = dbIterators[type];
  const mappedData = Object.assign({}, data);

  for(let i in map) {
    if(!data[i]) continue;

    const replace = map[i];
    mappedData[replace] = mappedData[i];
    delete mappedData[i];

    if(!iterator || !Array.isArray(mappedData[replace])) continue;

    const items = mappedData[replace].map(item => {
      for(let j in iterator) {
        const key = iterator[j];
        if(item[j]) {
          item[key] = item[j];
          delete item[j];
        }
      }
      return item;
    });
    mappedData[replace] = items;
  }
  return mappedData;
}
