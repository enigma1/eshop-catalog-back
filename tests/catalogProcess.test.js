import catalogProcess from '^/catalogProcess';
jest.mock('^/catalogProcess', () => {
  return {};
});

describe('catalogRoutes must be present', () => {
  beforeEach(() => {

  });

  it('base test', () => {
    expect(true).toBe(true);
  })
})
