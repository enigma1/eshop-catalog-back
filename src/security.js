import { getRandomID } from '^/utils';

//Checking the crypto module
import crypto from 'crypto';
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const padStrSize = 5;

/*
//Encrypting text
export const encode = text => {
   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypting text
export const decode = text => {
   let iv = Buffer.from(text.iv, 'hex');
   let encryptedText = Buffer.from(text.encryptedData, 'hex');
   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
}
*/

export const encode = (id, rev) => {
  const rID = getRandomID({selection: 'x', size: padStrSize});
  const l = id.length;
  const [revID, revData] = rev.split('-');
  return [l,revID,rID.concat(id)].join('|').concat(revData);
}

export const decode = (key) => {
  const [l, revID, dAll] = key.split('|');
  const data = dAll.substr(padStrSize);
  const id = data.substr(0, l);
  const revData = data.substr(l);
  const rev = [revID, revData].join('-');
  return {
    id,
    rev
  };
}

export const test = () => {
  const t2 = encode('f174964465b6a66e25c98bffff006fa4', '8-9c435fae393218027a0a003fb7d81a43');
  const d2 = decode(t2);
  console.log('t2', t2, d2);
  // Text send to encrypt function
  //var hw = encode("f174964465b6a66e25c98bffff006fa4|8-9c435fae393218027a0a003fb7d81a43")
  //var hw = encode("32|8|f174964465b6a66e25c98bffff006fa489c435fae393218027a0a003fb7d81a43")
  //console.log(hw)
  //console.log(decode(hw))
}

export const removeIdentification = (obj, params=[]) => {
  const allParams = [...params, '_id', '_rev', 'id', 'rev', 'table_id'];
  allParams.forEach(entry => delete obj[entry]);
}

export const getCleanData = (schema, query, exceptions=[]) => {
  let result = true;
  const t1 = Object.keys(query);
  t1.every(entry => {
    result = schema[entry]===undefined && !exceptions.includes(entry)?false:true;
    console.log(entry, result);
    return result;
  })
  console.log('rrrrrrr', result, exceptions)
  return result;
}

const security = {
  encode,
  decode,
  removeIdentification,
  getCleanData
}

export default security;
