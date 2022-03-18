export default function collapse() {
  document.addEventListener('alpine:init', () => {
    Alpine.data('collapse', (initialState = false) => ({
      expanded: initialState,
      toggle: {
        ['@click']() {
          this.expanded = ! this.expanded
        },
      },
      dialogue: {
        ['x-show']() {
          return this.expanded
        },
      },
    }))
  })
}