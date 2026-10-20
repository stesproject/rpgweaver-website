import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://rpg-weaver.web.app",
  compressHTML: true,
  integrations: [sitemap()],
  vite: {
    resolve: {
      tsconfigPaths: false
    },
    plugins: [tailwindcss()]
  }
});
