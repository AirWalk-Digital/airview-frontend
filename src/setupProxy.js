const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://apim-airview-stg.azure-api.net/",
      pathRewrite: {
        "^/api": "/", // remove base path
      },
      changeOrigin: true,
      /* logLevel: "debug", */
    })
  );

  /* app.use(
   *   "/gitproxy",
   *   createProxyMiddleware({
   *     target: "http://localhost:7071/api/",
   *     pathRewrite: {
   *       "^/gitproxy": "/", // remove base path
   *     },
   *     changeOrigin: true,
   *   })
   * );
   */
};
