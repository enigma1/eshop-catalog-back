module.exports = (api) => {
  api.cache(false);
  return {
    "presets": [
      "@babel/preset-env"
    ],
    "plugins": [
      ["@babel/plugin-transform-runtime", { "regenerator": true }],
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", { "loose" : true }],
      ["@babel/plugin-transform-template-literals", {"loose": true }]
    ],
    "env": {
      "development": {
        "plugins": [
          ["babel-plugin-root-import", {
            "functions": ["jest.mock"],
            "paths": [
              {
                root: __dirname,
                "rootPathPrefix": "^/",
                "rootPathSuffix": "src"
              },
              {
                root: __dirname,
                "rootPathPrefix": "!/",
                "rootPathSuffix": ""
              },
              {
                root: __dirname,
                "rootPathPrefix": "?/",
                "rootPathSuffix": "tests"
              },
              {
                root: __dirname,
                "rootPathPrefix": "~/",
                "rootPathSuffix": "assets/images"
              }
            ]
          }]
        ]
      }
    }
  }
}