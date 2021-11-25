export async function initMswWorker() {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (typeof global.process === "undefined") {
    const { worker } = require("../src/api-mock/browser");

    if (process.env.NODE_ENV === "production") {
      await worker.start({
        serviceWorker: {
          url: "/airview-frontend/mockServiceWorker.js",
        },
      });

      return;
    }

    worker.start();
  }
}
