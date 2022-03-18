---
_root: '../../../'
layout: docs
group: Components
title: Dropdown
data: 
  action:
    label: Dropdown
    icon: cherov-down
  menu:
    align: start-start
    divider: true
    nav:
      - title: List item 1
        href: '#'
        class: some-class
---

{% render 'components/dropdown/docs/examples.html', dropdown: data %}