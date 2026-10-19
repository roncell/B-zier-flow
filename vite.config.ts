import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// base "./" keeps asset paths relative, so the build works at any sub-path
// (e.g. /bezier/ on the portfolio) as well as at a domain root.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1600 },
})
