import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false
});

export const prepareDBRequest = (reqFields) => {
  const {token, method='GET', headers={}} = reqFields;
  const reqBody = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    credentials: 'include',
    // mode: 'cors',
    cache: 'no-cache',
    // referrerPolicy: 'no-referrer',
    agent
  };
  // console.log({...reqBody, ...headers})
  return {...reqBody, ...headers};
};

export const getRandomID = ({selection='a#', size=16}) => {
  const patterns = {
    'a': 'abcdefghijklmnopqrstuvwxyz',
    'A': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '#': '0123456789',
    '-': '-_',
    '!': '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\',
    'x': '0123456789abcdef',
    'X': '0123456789ABCDEF',
    '0': '01',
    'd': Date.now()
  }

  let result = '';
  let combo = [...selection].map(entry => patterns[entry]);
  let comboString = combo.join('');
  for(let i = 0; i<size; i++) {
    result += comboString[Math.floor(Math.random() * (i?comboString.length:combo[0].length))];
  }
  return result;
}

const utils = {
  prepareDBRequest,
  getRandomID
}

export default utils;
