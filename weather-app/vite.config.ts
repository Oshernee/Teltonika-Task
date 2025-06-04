import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [vue()],
    define: {
      "import.meta.env.VITE_API_KEY": JSON.stringify(env.VITE_API_KEY),
    },
    server: {
      proxy: {
        "/api": {
          target: "https://api.openweathermap.org/data/2.5",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
