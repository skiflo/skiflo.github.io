import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * GitHub Pages base path.
 * - Org/user site repo (`*.github.io`) → `/` at https://org.github.io/
 * - Project site repo (`website`) → `/website/` at https://org.github.io/website/
 */
function githubPagesBase(): string {
  if (process.env.GITHUB_PAGES !== "true") return "/";
  const name = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (!name || name.endsWith(".github.io")) return "/";
  return `/${name}/`;
}

export default defineConfig({
  plugins: [react()],
  base: githubPagesBase(),
});
