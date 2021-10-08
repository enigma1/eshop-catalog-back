## EShop Catalog in ReactJS

Catalog back end server for ecommerce shops

Built with [fastify](https://www.fastify.io/)

The second part of the eshop is the back end server for the catalog part. There are 4 parts total
 - Interacts with the couchDB and the catalog front-end
 - Transforms requests from the front-end to the database and vice versa

Brief description of the tree files
- Server configuration is in config.js
- Server Startup file is start.js
- Front-end routing handling for products, categories, manufacturers is in catalogRoutes.js. Associated functions in catalogProcess.js
- Front-end routing handling for customers, accounts, orders is in customerRoutes.js. Associated functions  in customerProcess.js
- Database requests are in dbaseCatalog.js and dbaseCustomer.js

#### Configuration

- Layout Configuration is retrieved from the back-end and stored in local storage during startup
- Page Routing is ln the routing.json section


#### Installation
 - npm i

 #### Run Back End
 - npm run watch - run/watch for dev
 - npm run build - build only