export default function clipboard() {
  new ClipboardJS('.btn-clipboard')
    .on("success", function(e) {
      e.clearSelection();
    }).on("error", function(e) {
      e.clearSelection();
    });
}