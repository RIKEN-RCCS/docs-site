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

function normalizePath(pathname) {
  return pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
}

function hasPathSegment(pathname, segment) {
  return normalizePath(pathname).split("/").indexOf(segment) !== -1;
}

function hideOtherLanguageSection() {
  var path = window.location.pathname;
  var isJa = hasPathSegment(path, 'ja');
  var isEn = hasPathSegment(path, 'en');
  if (!isJa && !isEn) return;

  // セクション（English）の表示制御
  document.querySelectorAll('.md-nav--primary > .md-nav__list > .md-nav__item--section').forEach(function(item) {
    var label = item.querySelector('.md-ellipsis');
    if (!label) return;
    var text = label.textContent.trim();
    if (isJa && text === 'English') item.style.display = 'none';
  });

  // 個別ページ項目の表示制御
  document.querySelectorAll('.md-nav--primary > .md-nav__list > .md-nav__item:not(.md-nav__item--section)').forEach(function(item) {
    var link = item.querySelector('a.md-nav__link');
    if (!link) return;
    try {
      var fullPath = new URL(link.getAttribute('href'), window.location.href).pathname;
      if (isEn && hasPathSegment(fullPath, 'ja')) item.style.display = 'none';
      if (isJa && !hasPathSegment(fullPath, 'ja')) item.style.display = 'none';
    } catch(e) {}
  });
}

setShellCopyText();
hideOtherLanguageSection();

if (window.document$) {
  window.document$.subscribe(function () {
    setShellCopyText();
    hideOtherLanguageSection();
  });
}
