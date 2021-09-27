import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export const envConfig = {
  ssl: {
    key: fs.readFileSync('../websites/rootCA.key'),
    cert: fs.readFileSync('../websites/rootCA.pem'),
    passphrase: 'password'
  },
  port: process.env.PORT || 5000
};

export const dbCatalogConfig = {
  url: "https://127.0.0.2:6984",
  // db: "ataxia",
  db: "test0",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZvbyJ9.eyJzdWIiOiJBZG1pbjMiLCJpYXQiOjE1MTYyMzkwMjJ9.tMIKNX_EMqg_gSx5n9ILm4XIYPQuqrCeI7cdITs1ED8"
};

export const dbCustomersConfig = {
  url: "https://127.0.0.2:6984",
  db: "customers",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZvbyJ9.eyJzdWIiOiJBZG1pbjMiLCJpYXQiOjE1MTYyMzkwMjJ9.tMIKNX_EMqg_gSx5n9ILm4XIYPQuqrCeI7cdITs1ED8"
};

// export const mediaCatalogServer = {
//   cmd: "http-server -p8888 -S -C cert.pem -K key.pem -a www.example.com",
// };

const config = {envConfig, dbCatalogConfig, dbCustomersConfig};

export default config
// module.exports = ssl
