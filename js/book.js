(function () {
  'use strict';

  function hideCanvas() {
    var sidebar = document.querySelector('.book-sidebar');
    var overlay = document.querySelector('.off-canvas-overlay');
    if (sidebar) sidebar.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
  }

  function openSidebar() {
    var sidebar = document.querySelector('.book-sidebar');
    var overlay = document.querySelector('.off-canvas-overlay');
    if (sidebar) sidebar.classList.add('show');
    if (overlay) overlay.classList.add('show');
  }

  function toggleSidebar() {
    var toggle = document.querySelector('.sidebar-toggle');
    var sidebar = document.querySelector('.book-sidebar');
    var content = document.querySelector('.off-canvas-content');
    if (!toggle || !sidebar || !content) return;

    toggle.classList.toggle('extend');
    sidebar.classList.toggle('hide');
    content.classList.toggle('extend');
  }

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  // 让 giscus iframe 跟随日夜模式
  function syncGiscus(theme) {
    var iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe || !iframe.contentWindow) return;

    var giscus = theme === 'dark' ? 'dark' : 'light';
    // 本地自定义主题不区分明暗时，保持原样；这里仅在已配置外部主题时跳过
    if (typeof window.__GISCUS_THEME_LIGHT__ === 'string') {
      giscus = theme === 'dark'
        ? (window.__GISCUS_THEME_DARK__ || giscus)
        : (window.__GISCUS_THEME_LIGHT__ || giscus);
    }

    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: giscus } } },
      'https://giscus.app'
    );
  }

  function setTheme(theme) {
    var next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try {
      window.localStorage.setItem('theme', next);
    } catch (e) { /* ignore */ }
    syncGiscus(next);
  }

  function toggleTheme() {
    setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }

  // 点击事件委托：[data-action] 本身或其子元素都可点击
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-action]');
    if (!trigger) return;

    var action = trigger.getAttribute('data-action');

    if (action === 'open-sidebar') {
      event.preventDefault();
      openSidebar();
    } else if (action === 'close-sidebar') {
      event.preventDefault();
      hideCanvas();
    } else if (action === 'toggle-sidebar') {
      event.preventDefault();
      toggleSidebar();
    } else if (action === 'toggle-theme') {
      event.preventDefault();
      toggleTheme();
    }
  });
})();
