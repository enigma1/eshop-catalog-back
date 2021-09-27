import path from 'path'
import history  from 'connect-history-api-fallback';
import {envConfig} from '^/config'
import fcors from 'fastify-cors'
import fstatic from 'fastify-static'
import {createRoutes as catalogRoutes} from '^/catalogRoutes'
import {createRoutes as customerRoutes} from '^/customerRoutes'

const {port} = envConfig;

const optionsCORS = {
  allowedHeaders: '*',
  exposedHeaders: '*'
};
server.register(fcors, optionsCORS);

const optionsStatic = {
  root: path.join(__dirname, 'public')
};

server.register(fstatic, optionsStatic);

catalogRoutes();
customerRoutes();
// Start server
server.listen(port, (error) => {
  if(error) throw error;
  console.log(`Listening on port ${port}`)
});

