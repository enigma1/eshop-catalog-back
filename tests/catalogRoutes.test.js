import catalogProcess from '^/catalogProcess';
import {createRoutes} from '^/catalogRoutes';

jest.mock('^/catalogProcess', () => {
  return {
    serverTest: (req, res) => 'result from serverTest'
  }
});

describe('In catalogRoutes -', () => {
  beforeEach(() => {
    globalThis.server = {
      get: (name,handler) => {
        return catalogProcess[handler];
      }
    };
    createRoutes();
  });

it('functional get service', () => {
    expect(catalogProcess.serverTest()).toBe('result from serverTest');
  })
})
