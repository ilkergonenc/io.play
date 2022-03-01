---
_root: '../'
title: Typography
example: bend design system is awesome!
typo: 
  - title: Display x-large
    class: display-xl
  - title: Display large
    class: display-lg
  - title: Display medium
    class: display-md
  - title: Display small
    class: display-sm
  - title: PageHeading
    class: heading-page
  - title: Heading
    class: heading
  - title: Subheading
    class: heading-sub
  - title: Button
    class: typo-button
  - title: Link
    class: typo-body underline
  - title: Body
    class: typo-body
  - title: Caption
    class: typo-caption
---
{% render 'typo', text: example, typo: typo %}
