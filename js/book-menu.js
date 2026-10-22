(function () {
  'use strict';

  var SIDEBAR_POS_KEY = 'sidebarPos';

  function collapse(name, body, index) {
    if (name.classList.contains('accordion')) {
      var accoBody = name.querySelector('.accordion-body');
      if (accoBody) accoBody.appendChild(body);
      return name;
    }

    var accordion = document.createElement('div');
    accordion.className = 'accordion';

    var accoBody = document.createElement('div');
    accoBody.className = 'accordion-body';
    accoBody.appendChild(body);

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'accordion-' + index;
    checkbox.hidden = true;

    var label = document.createElement('label');
    label.textContent = name.textContent;
    label.className = 'accordion-header c-hand';
    label.setAttribute('for', 'accordion-' + index);

    var icon = document.createElement('i');
    icon.className = 'icon icon-arrow-down';
    label.appendChild(icon);

    accordion.appendChild(checkbox);
    accordion.appendChild(label);
    accordion.appendChild(accoBody);

    name.parentNode.replaceChild(accordion, name);
  }

  // 移除 menu.md 里被 Hexo 包出来的无效节点（<p> 等）
  function clearInvalidSyntax() {
    var invalid = document.querySelectorAll(
      '.book-menu > :not(ul):not(ol):not(h1):not(h2):not(h3):not(h4):not(h5):not(h6)'
    );
    invalid.forEach(function (element) {
      element.parentNode.removeChild(element);
    });
  }

  // 把 h1/h2... 后面的列表折叠成 accordion
  function packMenuAccordion() {
    document.querySelectorAll('.book-menu > ul, .book-menu > ol').forEach(function (list, index) {
      var sibling = list.previousElementSibling;

      while (sibling) {
        if (/^H[1-6]$/.test(sibling.tagName)) break;
        sibling = sibling.previousElementSibling;
      }

      if (!sibling || sibling.tagName === 'H1') {
        list.classList.add('uncollapsible');
      } else {
        collapse(sibling, list, index);
      }
    });
  }

  // 高亮当前页面，并展开它所在的折叠组
  function highlightCurrentTab() {
    var current = window.location.href.split('#')[0].replace(/\/$/, '');

    document.querySelectorAll('.book-menu a').forEach(function (item) {
      var href = item.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;

      var itemHref = item.href.split('#')[0].replace(/\/$/, '');
      if (itemHref !== current) return;

      item.classList.add('current-tab');

      var parent = item.parentNode;
      while (parent && !parent.classList.contains('book-menu')) {
        if (parent.classList.contains('accordion')) {
          var checkbox = parent.querySelector('input');
          if (checkbox) checkbox.checked = true;
          break;
        }
        parent = parent.parentNode;
      }
    });
  }

  function showSidebar() {
    var menu = document.getElementById('menu');
    if (menu) menu.classList.remove('hide');
  }

  function restoreSidebarPosition() {
    var stored = window.localStorage.getItem(SIDEBAR_POS_KEY);
    if (stored === null) return;
    var menu = document.querySelector('.book-menu');
    if (menu) menu.scrollTop = Number(stored) || 0;
  }

  document.addEventListener('DOMContentLoaded', function () {
    clearInvalidSyntax();
    packMenuAccordion();
    highlightCurrentTab();
    showSidebar();
    restoreSidebarPosition();
  });

  window.addEventListener('beforeunload', function () {
    var menu = document.querySelector('.book-menu');
    if (menu) window.localStorage.setItem(SIDEBAR_POS_KEY, String(menu.scrollTop));
  });
})();
