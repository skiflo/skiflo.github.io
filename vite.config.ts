import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/** Project Pages base path, e.g. /website/ for https://skiflo.github.io/website/ */
function githubPagesBase(): string {
  if (process.env.GITHUB_PAGES !== "true") return "/";
  const repo = process.env.GITHUB_REPOSITORY;
  const name = repo?.split("/")[1];
  return name ? `/${name}/` : "/";
}

export default defineConfig({
  plugins: [react()],
  base: githubPagesBase(),
});
