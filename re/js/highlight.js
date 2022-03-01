export default function highlight() {
  const codeHtml = [].slice.call(document.querySelectorAll('code.language-html'));
  codeHtml.map(element => element.textContent = element.innerHTML.trim());
  hljs.highlightAll();
}