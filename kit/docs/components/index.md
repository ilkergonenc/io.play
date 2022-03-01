---
_root: '../'
layout: docs
title: Docs
foo:
  title: Foo Board
  activeTab: 3
  tabs:
    - title: preview
      body: docs/components/foo.html
    - title: html
      body: docs/components/foo.html
    - title: js
      body: docs/components/foo.js
bar: Tailwind UI is a collection of professionally designed, pre-built, fully responsive HTML snippets you can drop into your Tailwind projects. Get started by checking out our free preview components, or browsing the PNG previews in the categories you're most curious about.
---
<!-- Clipboard & Highlight -->
{% render 'board', DATA: foo %}

<!-- Callout & Alert-->
<div class="callout">
  {{ bar }}
</div>
