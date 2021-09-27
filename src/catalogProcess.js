import dbaseCatalog from '^/dbaseCatalog'
import {test as test3} from '^/security.js';
import {remap} from '^/dataRemap';

// Execute a view
const dbView = (dbPath, res) => dbaseCatalog.view(dbPath).then(dbData => {
  console.log(dbData);
  res.send(dbData);
});

const getID = (req, res) => {
  const query = req.query;
  let id = dbaseCatalog.filter(query.id);
  dbaseCatalog.getByID(id).then(dbData => {
    const clientData = remap(dbData, 'doc-id');
    console.log(clientData);
    res.send(clientData);
  });
};

const productsViews = (req, res) => {
  const query = req.query;
  let key = dbaseCatalog.filter(query.key, true);
  let view = dbaseCatalog.filter(query.view);
  let limit = parseInt(query.limit);
  let dbPath = `products/_view/${view}`;
  let parts = [];

  key && parts.push(`key=${key}`);

  if( !isNaN(limit) && limit > 0) {
    parts.push(`limit=${limit}&reduce=false`);
  }
  dbPath = `${dbPath}?${parts.join('&')}`;
  dbView(dbPath, res);
};

const categoriesViews = (req, res) => {
  const query = req.query;
  let key = dbaseCatalog.filter(query.key, true);
  let view = dbaseCatalog.filter(query.view);
  let limit = parseInt(query.limit);
  let dbPath = `categories/_view/${view}`;
  let parts = [];

  key && parts.push(`key=${key}`);

  if( !isNaN(limit) && limit > 0) {
    parts.push(`limit=${limit}&reduce=false`);
  }

  dbPath = `${dbPath}?${parts.join('&')}`;
  dbView(dbPath, res);
};

const manufacturersViews = (req, res) => {
  const query = req.query;
  let key = dbaseCatalog.filter(query.key, true);
  let view = dbaseCatalog.filter(query.view);
  let limit = parseInt(query.limit);
  let dbPath = `manufacturers/_view/${view}`;
  let parts = [];

  key && parts.push(`key=${key}`);

  if( !isNaN(limit) && limit > 0) {
    parts.push(`limit=${limit}&reduce=false`);
  }

  dbPath = `${dbPath}?${parts.join('&')}`;
  dbView(dbPath, res);
};

const checkoutModuleViews = (res, view) => {
  const dbPath = `checkout-modules/_view/${view}`;
  dbaseCatalog.view(dbPath).then(dbData => {
    const clientData = remap(dbData, 'doc-id');
    res.send(clientData);
  });
};

const shippingViews = (req, res) => {
  checkoutModuleViews(res, 'shipping')
};

const paymentViews = (req, res) => {
  checkoutModuleViews(res, 'payment')
};

const totalViews = (req, res) => {
  checkoutModuleViews(res, 'totals')
};

const serverTest = (req, res) => {
  test3();
  res.send({
    success: 'Server is running',
    serverTime: Date.now()
  });
};

const all = (req, res) => {
  dbaseCatalog.all().then(dbData => {
    res.send(dbData);
  });
};

const errorRequest = (res, error) => {
  const result = {
    error: error
  }
  res.send(result);
}

const searchInProducts = (req, res) => {
  const query = req.body;
  const keywords = query.keywords.replace(/\W/g, ' ') || '';

  if(!keywords.length) return errorRequest(res, 'Nothing to search for');

  const wordsFiltered = keywords.split(' ').filter( entry => entry.length > 1);
  const wordsUnique = wordsFiltered.filter( (entry, current, original) => original.indexOf(entry) === current);

  if(!wordsUnique.length) return errorRequest(res, 'Invalid search characters');

  const wordsRegEx = wordsUnique.map((entry) => `(?=.*\\b${entry}\\b)`);
  let sep = '';
  if(query.shouldMatchAnyWord) sep = '|';

  const searchRegEx = wordsRegEx.join(sep);
  const searchObject = {"$regex": `^(?im)${searchRegEx}.+`}

  // const searchRequest = {
  //   // "fields": [
  //   //   "table_id", "status", "sort", "name", "short", "model", "vendor_sku", "seller_tag"
  //   // ],
  //   "selector": {
  //     "table_id": {
  //       "$eq": 1
  //     },
  //     "status": {
  //       "$eq": 1
  //     },
  //     "name": {"$regex": `^(?im)${searchRegEx}.+`},
  //     //"model": {"$regex": `^(?im)${searchRegEx}.+`},
  //     //"name": {"$regex": `^(?im)(?=.*\\bintel\\b)(?=.*\\bi5\\b)(?=.*\\bghz\\b).+`},
  //     //"name": {"$regex": `^(?=.*\\bIntel)`},
  //     //"name": {"$regex": `(?im)${keywords}\\w+`},
  //     //"name": {"$regex": `(?im)${keywords}`},
  //     //"short": {"$regex": keywords},
  //     //"model": {"$regex": keywords},
  //     //"desc": '',
  //     //"desc": {"$regex": "^keyword"},
  //   },
  //   //"fields": ["_id", "pid", "mid", "cid", "name", "short", "model"],
  //   //"sort": [{"sort": "desc"}],
  //   "use_index": "products-index",
  //   "limit": query.limit || 10,
  //   "skip": 0,
  //   "execution_stats": true
  // }



  const searchRequest = {
    "selector": {
      "table_id": {
        "$eq": 1
      },
      "status": {
        "$eq": 1
      },
    },
    "use_index": "products-index",
    "limit": query.limit || 10,
    "skip": 0,
    "execution_stats": true
  }

  const selector = searchRequest.selector;

  if(query.shouldMatchDescriptions | query.shouldMatchAnyField) {
    selector.$or = [
      {name: searchObject}
    ];
  } else {
    selector.name = searchObject;
  }

  if(query.shouldMatchDescriptions) {
    selector.$or.push({short: searchObject});
    selector.$or.push({desc: searchObject});
  }

  if(query.shouldMatchAnyField) {
    selector.$or.push({model: searchObject});
    selector.$or.push({vendor_sku: searchObject});
    selector.$or.push({seller_tag: searchObject});
  }

  //console.log('-----------Requesting', query, searchRequest, 'end-request-----------------');
  dbaseCatalog.get(searchRequest).then(dbData => {
    const clientData = remap(dbData, 'find');
    console.log('selector', clientData);
    res.send(clientData);
  });
};


const catalogProcess = {
  all,
  serverTest,
  getID,
  productsViews,
  categoriesViews,
  manufacturersViews,
  searchInProducts,
  shippingViews,
  paymentViews,
  totalViews
};

export default catalogProcess;