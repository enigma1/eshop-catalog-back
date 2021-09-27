// Create a certification and start the media server for the database elements
// Certificate
// openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
// Then start the server. Server/Media/catalog
// http-server -p8888 -S --passwordpassword -C cert.pem -K key.pem

// Get the babel configuration
const babelConfig = require('./babel.config.js');
require("@babel/register")(babelConfig);

// Import the app
module.exports = Object.assign({},
  require('./globals.js'),
  require('./src/server.js')
);
