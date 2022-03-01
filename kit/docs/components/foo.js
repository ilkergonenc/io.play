const codeHtml = [].slice.call(document.querySelectorAll('code.html'));
codeHtml.map(element => element.textContent = element.innerHTML.trim());
hljs.highlightAll();