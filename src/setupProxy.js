const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_PROXY_API_ENDPOINT,
      pathRewrite: {
        "^/api": "/", // remove base path
      },
      secure: false,
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
