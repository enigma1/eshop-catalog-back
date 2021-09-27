import bcrypt from 'bcrypt';
import dbaseCustomers from '^/dbaseCustomers'
import {remap} from '^/dataRemap';
import {errorList} from '^/errors';
import {encode, decode, removeIdentification, getCleanData} from '^/security';
import * as tableInfo from "^/Config/tableSchemas.json";

// Execute a view
const dbView = (dbPath, res) => dbaseCustomers.view(dbPath).then(dbData => {
  console.log(dbData);
  res.send(dbData);
});

const getID = (req, res) => {
  const query = req.query;
  let id = dbaseCustomers.filter(query.id);
  dbaseCustomers.getByID(id).then(dbData => {
    const clientData = remap(dbData, 'doc-id');
    console.log(clientData);
    res.send(clientData);
  });
};

const getCustomer = (req, res) => {
  //const {email, password} = req;
  //const {email} = req;
  console.log('rrrrr', req)
  dbaseCustomers.find(req).then(dbData => {
    console.log('customer data', dbData);
    const clientData = remap(dbData, 'email');
    console.log('clientData', clientData);
    res.send(clientData);
  });
};

const getCustomerByEmail = async email => {
  const req = {
    "selector": {
      "table_id": {
        "$eq": 1
      },
      "status": {
        "$eq": 1
      },
      "email": {
        "$eq": email
      }
    },
    "use_index": "email",
    "limit": 1,
    "skip": 0,
    "execution_stats": true
  }
  return await dbaseCustomers.find(req);
}

const customersViews = (req, res) => {
  const query = req.query;
  let key = dbaseCustomers.filter(query.key, true);
  let view = dbaseCustomers.filter(query.view);
  let limit = parseInt(query.limit);
  let dbPath = `orders/_view/${view}`;
  let parts = [];

  key && parts.push(`key=${key}`);

  if( !isNaN(limit) && limit > 0) {
    parts.push(`limit=${limit}&reduce=false`);
  }
  dbPath = `${dbPath}?${parts.join('&')}`;
  dbView(dbPath, res);
};

const ordersViews = (req, res) => {
  const query = req.query;
  let key = dbaseCustomers.filter(query.key, true);
  let view = dbaseCustomers.filter(query.view);
  let limit = parseInt(query.limit);
  let dbPath = `orders/_view/${view}`;
  let parts = [];

  key && parts.push(`key=${key}`);

  if( !isNaN(limit) && limit > 0) {
    parts.push(`limit=${limit}&reduce=false`);
  }
  dbPath = `${dbPath}?${parts.join('&')}`;
  dbView(dbPath, res);
};

const ordersViewsCustomer = (req, res) => {
  const query = req.query;
  let key = dbaseCustomers.filter(query.key, true);
  let view = dbaseCustomers.filter(query.view);
  let limit = parseInt(query.limit);
  let dbPath = `orders/_view/${view}`;
  let parts = [];

  key && parts.push(`key=${key}`);

  if( !isNaN(limit) && limit > 0) {
    parts.push(`limit=${limit}&reduce=false`);
  }

  dbPath = `${dbPath}?${parts.join('&')}`;
  dbView(dbPath, res);
};

const serverTest = (req, res) => {
  res.send({
    success: 'Server is running',
    serverTime: Date.now()
  });
};

const allCustomers = (req, res) => {
  dbaseCustomers.allData(`customers/_view/listing`).then(dbData => {
    res.send(dbData);
  });
};

const allData = (req, res) => {
  dbaseCustomers.allData().then(dbData => {
    res.send(dbData);
  });
};

const all = (req, res) => {
  dbaseCustomers.all().then(dbData => {
    res.send(dbData);
  });
};

const errorRequest = (res, error) => {
  const result = {
    error: error
  }
  res.send(result);
}

const passwordCheck = async (password, hash) => {
  if(!hash) return Promise.resolve(false);
  return await bcrypt.compare(password, hash);
}

const hashCreate = async (plainPassword, saltRounds=10) => {
  const hashPromise = await bcrypt.hash(plainPassword, saltRounds);
  return await hashPromise;
}

const createAddressBookEntry = (req, res) => {

}

const createAccount = async (req, res) => {
  const isClean = getCleanData(tableInfo.customers, req.body, ['password']);
  if(!isClean) return Promise.resolve({error: 'Invalid request'});

  const query = req.body;
  const existent = await getCustomerByEmail(query.email);
  console.log('exists', existent)
  if(typeof existent === 'object' && existent.docs && Array.isArray(existent.docs) && existent.docs.length) {
    return Promise.resolve({error: 'Account already exists'});
  }

  const hash = await hashCreate(query.password);
  query.hash = hash;
  delete query.password;

  query.since = Date.now();
  query.logged = [query.since];

  const fullQuery = {...tableInfo.customers, ...query};
  console.log('create customer-1', query, fullQuery);
  dbaseCustomers.create(fullQuery).then(async dbData => {
    fullQuery.cID = encode(dbData.id, dbData.rev);
    removeIdentification(fullQuery, ['hash', 'status', 'online']);
    console.log('encoded customer-3', fullQuery);
    res.send(fullQuery);
  });
  // console.log('create-account', query);
  // dbView(dbPath, res);
}

const loginCustomer = async (req, res) => {

  // const test3 = await hashCreate('t12345678');
  // console.log('pass', test3);

  const {email, password} = req.body;
    const data = {
    "selector": {
      "table_id": {
        "$eq": 1
      },
      "status": {
        "$eq": 1
      },
      "email": {
        "$eq": email
      }
    },
    "use_index": "email",
    "limit": req.body.limit || 10,
    "skip": 0,
    "execution_stats": true
  }

  const dbData = await dbaseCustomers.find(data);
  //console.log('dbData', dbData)
  //const clientArray = remap(dbData, 'find');
  const clientArray = dbData.docs || [{}];

  //console.log('db', clientArray);
  let clientData = clientArray[0] || {loginError: errorList.docNotFound}
  const pass = await passwordCheck(password, clientData.hash);
  if( pass ) {
    //console.log('cd', clientData)
    clientData.cID = encode(clientData._id, clientData._rev);
    removeIdentification(clientData, ['hash', 'status', 'online']);
  } else {
    //console.log('hash error', clientData);
    clientData = {loginError: errorList.docNotFound}
  }
  res.send(clientData);
}

const searchInCustomers = (req, res) => {
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
  dbaseCustomers.find(searchRequest).then(dbData => {
    const clientData = remap(dbData, 'find');
    console.log('selector', clientData);
    res.send(clientData);
  });
};


const customerProcess = {
  //all,
  allData,
  allCustomers,
  //serverTest,
  //getID,
  customersViews,
  ordersViews,
  ordersViewsCustomer,

  searchInCustomers,
  loginCustomer,
  createAccount,
  createAddressBookEntry
};

export default customerProcess;