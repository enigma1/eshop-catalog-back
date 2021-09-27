import customerProcess from '^/customerProcess'

const defaultProcess = () => {}

const getRoutes = {
  all: '/all-personal',
  allData: '/all-personal-data',
  allCustomers: '/all-customers',
  // root: '/',
  serverTest: '/customer-test',
  getCustomer: '/get-customer/*',
  ordersCustomer: '/orders-customer/*',
  ordersViews: '/orders-views/*',
  productOrderedViews: '/product-ordered-views/*',
};

const postRoutes = {
  createAccount: '/create-account',
  createAddressBookEntry: '/create-address-book-entry',
  loginCustomer: '/login-customer',
  searchInCustomers: '/search-in-customers',
  searchInOrders: '/search-in-orders',
}

const enableGetRoutes = () => {
  for(const [f,route] of Object.entries(getRoutes) ) {
    server.get(route, customerProcess[f] || defaultProcess);
  }
}

const enablePostRoutes = () => {
  for(const [f,route] of Object.entries(postRoutes) ) {
    server.post(route, customerProcess[f] || defaultProcess);
  }
}

export const createRoutes = () => {
  enableGetRoutes();
  enablePostRoutes();
}
