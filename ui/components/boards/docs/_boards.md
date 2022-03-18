---
_root: '../../../'
layout: docs
group: Components
title: Boards
foo:
  title: Board with tabs for highlight & preview
  activeTab: 3
  tabs:
    - title: preview
      body: docs/components/foo.html
    - title: html
      body: docs/components/foo.html
    - title: js
      body: docs/components/foo.js
---
<!-- Clipboard & Highlight -->
{% render 'components/boards/board', DATA: foo %}

