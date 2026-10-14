// Cloudflare Workers build (vinext). `npm run dev` / `npm run build` still use
// Next.js; this file only drives `npm run build:vinext` and `deploy:vinext`.
import { defineConfig, type Plugin } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { workersCacheCdnAdapter } from "@vinext/cloudflare/cache/workers-cache-cdn-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import { createHash } from "node:crypto";
import { patchCssModules } from "vite-css-modules";
import path from "node:path";

/**
 * vinext 1.1's next/image shim gives `fill` images no srcset and always
 * requests the 640px rendition, so full-width plates would be upscaled on
 * desktop. Next.js derives the srcset from `sizes`; do the same with the
 * shim's own helper. Fails the build if the shim changes, so an upgrade
 * cannot silently drop the fix.
 */
function fillImageSrcSet(): Plugin {
  const patches: [string, string][] = [
    [
      "const optimizedAttributes = imgWidth && !fill && !skipOptimization ? generateImageAttributes(src, imgWidth, imgQuality, sizes) : void 0;",
      'const optimizedAttributes = skipOptimization ? void 0 : fill ? generateImageAttributes(src, 0, imgQuality, sizes ?? "100vw") : imgWidth ? generateImageAttributes(src, imgWidth, imgQuality, sizes) : void 0;',
    ],
    [
      "const optimizedAttributes = imgWidth && !fill && !skipOpt ? generateImageAttributes(resolvedSrc, imgWidth, imgQuality, sizes) : null;",
      'const optimizedAttributes = skipOpt ? null : fill ? generateImageAttributes(resolvedSrc, 0, imgQuality, sizes ?? "100vw") : imgWidth ? generateImageAttributes(resolvedSrc, imgWidth, imgQuality, sizes) : null;',
    ],
  ];
  return {
    name: "diwan:fill-image-srcset",
    enforce: "pre",
    transform(code, id) {
      if (!id.replaceAll("\\", "/").endsWith("/vinext/dist/shims/image.js")) return;
      let out = code;
      for (const [from, to] of patches) {
        if (!out.includes(from)) throw new Error(`[diwan:fill-image-srcset] vinext image shim changed; review the fill srcset patch in vite.config.ts`);
        out = out.replace(from, to);
      }
      return { code: out, map: null };
    },
  };
}

export default defineConfig({
  plugins: [
    fillImageSrcSet(),
    patchCssModules({ exportMode: "default" }),
    vinext({
      // Pages are cached in Cloudflare's Workers Cache; every admin save purges
      // them (revalidatePath), as with Next.js ISR.
      cache: { cdn: workersCacheCdnAdapter() },
      // next/image resizing through the IMAGES (Cloudflare Images) binding.
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
  css: {
    modules: {
      generateScopedName(name: string, filename: string) {
        const relativePath = path.relative(import.meta.dirname, filename.replace(/\?.*$/, "")).replaceAll("\\", "/");
        return `_${name}_${createHash("sha256").update(relativePath).digest("hex").slice(0, 7)}`;
      },
    },
  },
});
