import { defineHastPlugin } from "satteri";

/** @type {"element"} */
const ELEMENT = "element";

/** @type {ReadonlyArray<string>} */
const ANCHOR_CLASS = [
  "group",
  "relative",
  "no-underline",
  "focus-visible:outline-2",
  "focus-visible:outline-accent",
  "focus-visible:outline-offset-4",
];

/** @type {ReadonlyArray<string>} */
const ICON_CLASS = [
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
];

function headingIcon() {
  return {
    type: ELEMENT,
    tagName: "svg",
    properties: {
      "aria-hidden": "true",
      className: [...ICON_CLASS],
      fill: "none",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      viewBox: "0 0 24 24",
    },
    children: [
      {
        type: ELEMENT,
        tagName: "path",
        properties: { d: "M0 0h24v24H0z", stroke: "none" },
        children: [],
      },
      {
        type: ELEMENT,
        tagName: "path",
        properties: { d: "M10 13a5 5 0 0 0 7.54 .54l3 -3a5 5 0 0 0 -7.071 -7.071l-1.71 1.71" },
        children: [],
      },
      {
        type: ELEMENT,
        tagName: "path",
        properties: { d: "M14 11a5 5 0 0 0 -7.54 -.54l-3 3a5 5 0 0 0 7.071 7.071l1.71 -1.71" },
        children: [],
      },
    ],
  };
}

/**
 * Wrap h2/h3 children in a permalink, matching the previous rehype-autolink-headings setup.
 * Astro's heading-id plugin runs after user plugins, so this must follow `satteriHeadingIdsPlugin`.
 */
export const headingAnchors = defineHastPlugin({
  name: "heading-anchors",
  element: {
    filter: ["h2", "h3"],
    visit(node) {
      const id = node.properties?.id;
      if (typeof id !== "string" || id.length === 0) {
        return;
      }

      const first = node.children[0];
      if (
        first?.type === "element" &&
        first.tagName === "a" &&
        first.properties &&
        "dataHeadingAnchor" in first.properties
      ) {
        return;
      }

      const anchor = {
        type: ELEMENT,
        tagName: "a",
        properties: {
          href: `#${id}`,
          className: [...ANCHOR_CLASS],
          dataHeadingAnchor: "",
        },
        children: [headingIcon(), ...node.children],
      };

      return {
        type: ELEMENT,
        tagName: node.tagName,
        properties: node.properties,
        children: [anchor],
      };
    },
  },
});

export const externalLinks = defineHastPlugin({
  name: "external-links",
  element: {
    filter: ["a"],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href !== "string") {
        return;
      }

      const isExternal = href.startsWith("https://") || href.startsWith("http://") || href.startsWith("//");
      if (!isExternal) {
        return;
      }

      ctx.setProperty(node, "target", "_blank");
      ctx.setProperty(node, "rel", "noopener noreferrer");
    },
  },
});
