import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import tailwindcss from "@tailwindcss/vite";
import pagefind from "./src/integrations/pagefind.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://zxsn.sh",
  trailingSlash: "never",
  prefetch: true,
  integrations: [mdx(), sitemap(), pagefind()],
  markdown: {
    processor: unified({
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: {
              className: [
                "group",
                "relative",
                "no-underline",
                "focus-visible:outline-2",
                "focus-visible:outline-accent",
                "focus-visible:outline-offset-4",
              ],
              dataHeadingAnchor: "",
            },
            content: {
              type: "element",
              tagName: "svg",
              properties: {
                "aria-hidden": "true",
                className: [
                  "pointer-events-none",
                  "absolute",
                  "-left-[0.5em]",
                  "top-0",
                  "size-[0.5em]",
                  "opacity-0",
                  "text-accent",
                  "transition-opacity",
                  "duration-150",
                  "group-hover:opacity-100",
                  "group-focus-visible:opacity-100",
                ],
                fill: "none",
                stroke: "currentColor",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                viewBox: "0 0 24 24",
              },
              children: [
                {
                  type: "element",
                  tagName: "path",
                  properties: { d: "M0 0h24v24H0z", stroke: "none" },
                  children: [],
                },
                {
                  type: "element",
                  tagName: "path",
                  properties: { d: "M10 13a5 5 0 0 0 7.54 .54l3 -3a5 5 0 0 0 -7.071 -7.071l-1.71 1.71" },
                  children: [],
                },
                {
                  type: "element",
                  tagName: "path",
                  properties: { d: "M14 11a5 5 0 0 0 -7.54 -.54l-3 3a5 5 0 0 0 7.071 7.071l1.71 -1.71" },
                  children: [],
                },
              ],
            },
            test: /** @param {{ tagName: string }} node */ (node) => node.tagName === "h2" || node.tagName === "h3",
          },
        ],
        [
          rehypeExternalLinks,
          {
            target: "_blank",
            rel: ["noopener", "noreferrer"],
          },
        ],
      ],
    }),
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Noto Serif",
      cssVariable: "--font-noto-serif",
      fallbacks: ["serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/noto-serif-normal.woff2"],
            weight: "100 900",
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/noto-serif-italic.woff2"],
            weight: "100 900",
            style: "italic",
            display: "swap",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Noto Sans",
      cssVariable: "--font-noto-sans",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/noto-sans-normal.woff2"],
            weight: "100 900",
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/noto-sans-italic.woff2"],
            weight: "100 900",
            style: "italic",
            display: "swap",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Noto Sans Mono",
      cssVariable: "--font-noto-sans-mono",
      fallbacks: ["monospace"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/noto-sans-mono.woff2"],
            weight: "100 900",
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
