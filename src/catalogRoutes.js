
import catalogProcess from '^/catalogProcess'

const defaultProcess = () => {}

const getRoutes = {
  all: '/all',
  root: '/',
  serverTest: '/test',
  getID: '/get-by-id/*',
  productsViews: '/products-views/*',
  categoriesViews: '/categories-views/*',
  manufacturersViews: '/manufacturers-views/*',
  shippingViews: '/shipping-views/*',
  paymentViews: '/payment-views/*',
  totalViews: '/total-views/*',
};

const postRoutes = {
  searchInProducts: '/search-in-products',
}

const enableGetRoutes = () => {
  for(const [f,route] of Object.entries(getRoutes) ) {
    server.get(route, catalogProcess[f] || defaultProcess);
  }
}

const enablePostRoutes = () => {
  for(const [f,route] of Object.entries(postRoutes) ) {
    server.post(route, catalogProcess[f] || defaultProcess);
  }
}

export const createRoutes = () => {
  enableGetRoutes();
  enablePostRoutes();
}
