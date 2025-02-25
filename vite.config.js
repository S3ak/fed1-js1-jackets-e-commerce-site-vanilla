import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        productDetails: resolve(__dirname, "product-details.html"),
        about: resolve(__dirname, "about.html"),
        checkout: resolve(__dirname, "checkout.html"),
        orderConfirmation: resolve(__dirname, "order-confirmation.html"),
      },
    },
  },
  server: {
    host: "0.0.0.0",
  },
});
