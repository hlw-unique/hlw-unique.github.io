(function () {
  'use strict';

  // 图片下方加 figcaption
  function addImageCaptions() {
    document.querySelectorAll('img[alt]').forEach(function (img) {
      var alt = img.getAttribute('alt');
      if (!alt) return;

      var caption = document.createElement('figcaption');
      caption.textContent = alt;
      img.parentNode.insertBefore(caption, img.nextSibling);
    });
  }

  // 表格外包一层，便于横向滚动
  function wrapTables() {
    document.querySelectorAll('.book-post > table, li > table').forEach(function (table) {
      if (table.parentNode.classList.contains('table-wrapper')) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  // 脚注悬浮提示
  function addFootnoteTooltips() {
    document.querySelectorAll('sup.footnote-ref').forEach(function (fn) {
      var anchor = fn.querySelector('a');
      if (!anchor) return;

      var href = anchor.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;

      var target = document.getElementById(href.slice(1));
      if (!target) return;

      var wrapper = document.createElement('span');
      wrapper.className = 'tooltip';
      wrapper.setAttribute('data-tooltip', target.innerText.replace(/↩/g, ''));
      fn.parentNode.insertBefore(wrapper, fn);
      wrapper.appendChild(fn);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    addImageCaptions();
    wrapTables();
    addFootnoteTooltips();
  });
})();
