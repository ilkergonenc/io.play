---
_root: '../../../'
layout: docs
group: Components
title: Tabs
foo:
  title: Tabs
  activeTab: 3
  tabs:
    - title: preview
      body: docs/components/foo.html
    - title: html
      body: docs/components/foo.html
    - title: js
      body: docs/components/foo.js
---

{% render 'components/boards/board', DATA: foo %}

