---
_root: '../'
title: Docs
DATA:
  foo:
    title: Foo
    tabs:
      preview: true
      html: true
      js: true
---


<!-- # {{ title }} -->

{% render 'board', DATA: DATA.foo %}
