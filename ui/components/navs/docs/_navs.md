---
_root: '../../../'
layout: docs
nav: docs\\foundation\\navigations
group: Components
title: Navs
foo:
  title: Navs
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

