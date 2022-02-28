export default function tooltips() {
  document.addEventListener('alpine:init', () => {
    Alpine.directive('tooltip', (el, {
      expression
    }) => {
      tippy(el, {
        content: expression
      })
    })
  })
}