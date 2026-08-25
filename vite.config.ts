import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
    // UtiliHub is deployed with Nitro on Vercel. Keep the target explicit
    // so dynamic SSR routes are emitted as Vercel server routes regardless
    // of whether the VERCEL environment variable is available during build.
    nitro({ preset: "vercel" }),
  ],
});
