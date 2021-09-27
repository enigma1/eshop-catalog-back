import {dbCustomersConfig} from '^/config';
import {getRandomID, prepareDBRequest} from '^/utils';

const {db, url, token} = dbCustomersConfig;

export const filter = (s, allowQuotes=false) => {
  if(!s) return s;
  if(allowQuotes) return s.replace(/([^a-z0-9-_\"\,\[\]]+)/gi, '');
  return s.replace(/([^a-z0-9-_]+)/gi, '');
}

const prepare = (method, headers) => prepareDBRequest({token, method, headers});

export const view = async (cmd, cache=true) => {
  const rqData = prepare();
  if(cache) delete rqData.cache;
  // const rq = new Request(`${couchDB.url}/${dbName}/_design/${cmd}`, rqData);
  const rq = [`${url}/${db}/_design/${cmd}`, rqData];
  //console.log('sent', `${url}/${db}/_design/${cmd}`);
  const result = await fetch(...rq);
  return result.json();
};

export const getByID = async (id, cache=true) => {
  let fID = filter(id);
  //console.log('data', id, 'vs', fID);
  const rqData = prepare();
  if(cache) delete rqData.cache;
  const rq = [`${url}/${db}/${fID}`, rqData];
  const result = await fetch(...rq);
  return result.json();
};

export const find = async (query, cache=true) => {
  // const filterChars = /([^a-z0-9-_]+)/gi;
  const rqData = prepare('POST');
  if(cache) delete rqData.cache;
  rqData.body = JSON.stringify(query);
  const rq = [`${url}/${db}/_find`, rqData];
  const result = await fetch(...rq);
  return result.json();
};

export const update = async (query, cache=true) => {
  // const filterChars = /([^a-z0-9-_]+)/gi;
  const rqData = prepare('PUT', {"If-Match": query.rev});
  delete query.rev;
  if(cache) delete rqData.cache;
  rqData.body = JSON.stringify(query);
  const rq = [`${url}/${db}/${query.id}`, rqData];
  const result = await fetch(...rq);
  return result.json();
};

export const allData = async (cmd='all', cache=true) => {
  // const filterChars = /([^a-z0-9-_]+)/gi;
  const rqData = prepare();
  if(cache) delete rqData.cache;
  //rqData.body = JSON.stringify(query);
  //const rq = [`${url}/${db}/_design/all-docs/_view/all`, rqData];
  //const result = await fetch(`${url}/${db}/_design/all-docs/_view/all`, rqData);
  const result = await fetch(`${url}/${db}/_design/${cmd}`, rqData);
  //console.log(`${url}/${db}/_all_docs?include_docs=true`);
  //const result = await fetch(`${url}/${db}/_design/all-docs/_view/all?limit=3`, rqData);
  //console.log('result is', result);
  return result.json();
}

export const all = async (cmd, cache=true) => {
  // const filterChars = /([^a-z0-9-_]+)/gi;
  const rqData = prepare();
  if(cache) delete rqData.cache;
  //rqData.body = JSON.stringify(query);
  //const rq = [`${url}/${db}/_design/all-docs/_view/all`, rqData];
  //const result = await fetch(`${url}/${db}/_design/all-docs/_view/all`, rqData);
  const result = await fetch(`${url}/${db}/_all_docs`, rqData);
  //console.log(`${url}/${db}/_all_docs?include_docs=true`);
  //const result = await fetch(`${url}/${db}/_design/all-docs/_view/all?limit=3`, rqData);
  //console.log('result is', result);
  return result.json();
}

export const create = async (query, cache=true) => {
  // const filterChars = /([^a-z0-9-_]+)/gi;
  const rID = getRandomID({selection: 'a#', size: 32});
  const rqData = prepare('PUT');
  if(cache) delete rqData.cache;
  rqData.body = JSON.stringify(query);
  const rq = [`${url}/${db}/${rID}`, rqData];
  const result = await fetch(...rq);
  return result.json();
}

const dbaseCustomers = {
  all,
  allData,
  find,
  getByID,
  view,
  filter,
  update,
  create
};

export default dbaseCustomers;
