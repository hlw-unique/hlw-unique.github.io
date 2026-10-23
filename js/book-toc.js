(function () {
  'use strict';

  var COLLAPSED_DEPTH = 2;
  var EXPANDED_DEPTH = 6;

  function initToc(collapseDepth) {
    if (typeof tocbot === 'undefined') return;

    tocbot.init({
      tocSelector: '.book-tocbot',
      contentSelector: '.book-content',
      headingSelector: 'h1, h2, h3, h4, h5',
      collapseDepth: collapseDepth,
      orderedList: false,
      scrollSmooth: false
    });
  }

  function setExpandButton(expanded) {
    var button = document.querySelector('.book-toc-expand');
    if (!button) return;
    button.setAttribute('data-action', expanded ? 'collapse-toc' : 'expand-toc');

    // 文案由 toc.ejs 从主题配置传入，缺省为中文
    var expandLabel = button.getAttribute('data-expand-label') || '展开';
    var collapseLabel = button.getAttribute('data-collapse-label') || '收起';
    button.textContent = expanded ? collapseLabel : expandLabel;
  }

  function getMaxHeight() {
    var meta = document.querySelector('.book-post-meta');
    var menu = document.querySelector('.book-tocbot-menu');

    var metaHeight = meta ? meta.getBoundingClientRect().height : 0;
    var metaY = meta ? meta.getBoundingClientRect().y : 0;
    var menuHeight = menu ? menu.getBoundingClientRect().height : 0;

    return window.innerHeight - metaY - metaHeight - menuHeight - window.innerHeight * 0.15;
  }

  function updateMaxHeight() {
    var toc = document.querySelector('.book-tocbot');
    if (!toc) return;

    var meta = document.querySelector('.book-post-meta');
    if (meta) meta.classList.toggle('hide', window.scrollY > 600);

    toc.style.maxHeight = getMaxHeight() + 'px';
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-action]');
    if (!trigger) return;

    var action = trigger.getAttribute('data-action');

    if (action === 'expand-toc') {
      event.preventDefault();
      initToc(EXPANDED_DEPTH);
      setExpandButton(true);
    } else if (action === 'collapse-toc') {
      event.preventDefault();
      initToc(COLLAPSED_DEPTH);
      setExpandButton(false);
    } else if (action === 'go-top') {
      event.preventDefault();
      window.scrollTo(0, 0);
      setTimeout(updateMaxHeight, 150);
    } else if (action === 'go-bottom') {
      event.preventDefault();
      window.scrollTo(0, document.body.scrollHeight);
      setTimeout(updateMaxHeight, 150);
    }
  });

  window.addEventListener('load', updateMaxHeight);
  window.addEventListener('resize', updateMaxHeight);
  window.addEventListener('scroll', updateMaxHeight);

  document.addEventListener('DOMContentLoaded', function () {
    initToc(COLLAPSED_DEPTH);
    updateMaxHeight();
  });
})();
