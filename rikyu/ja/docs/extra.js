function setShellCopyText() {
  document.querySelectorAll(".language-bash.highlight code").forEach(function (code) {
    var text = code.innerText.replace(/\n$/, "");
    var lines = text.split("\n");

    if (!lines.some(function (line) { return line.startsWith("$ "); })) {
      return;
    }

    code.setAttribute(
      "data-copy",
      lines.map(function (line) {
        return line.startsWith("$ ") ? line.slice(2) : line;
      }).join("\n")
    );
  });
}

setShellCopyText();

if (window.document$) {
  window.document$.subscribe(function () {
    setShellCopyText();
  });
}
