export async function initMswWorker() {
  if (typeof global.process === "undefined") {
    const { worker } = require("../src/__mocks__/browser");

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
