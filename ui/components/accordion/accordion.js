export default function accordion() {
  document.addEventListener('alpine:init', () => {
    Alpine.data('accordion', (currentIndex = 0) => ({
      index: currentIndex,
      get expanded() {
        return this.accordionExpanded === this.index
      },
      set expanded(value) {
        this.accordionExpanded = value ? this.index : null
      },
    }))
  })
}