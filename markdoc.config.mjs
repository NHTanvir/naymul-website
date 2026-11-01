import { defineMarkdocConfig, nodes } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  nodes: {
    // Render post content without Markdoc's wrapping <article>, so the theme's
    // `.nt-single__content > p` rules (drop cap, spacing) apply directly.
    document: {
      ...nodes.document,
      render: null,
    },
  },
});
