/* mockup-view.js —— 设计稿演示专用
 *
 * 生产环境使用跨文档 View Transitions（@view-transition { navigation: auto }），
 * 一行 CSS 零 JS。设计稿在单文件内用同文档 VT 演示同款观感：
 * 视图切换 + 共享元素 morph（标题）。
 */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showView(id, push) {
    var views = document.querySelectorAll('[data-view]');
    for (var i = 0; i < views.length; i++) {
      views[i].hidden = views[i].getAttribute('data-view') !== id;
    }
    if (push) history.pushState({ view: id }, '', '#' + id);
    window.scrollTo(0, 0);
  }

  function swap(view, morphEl) {
    if (REDUCED || typeof document.startViewTransition !== 'function') {
      showView(view, false);
      return;
    }
    // 给被点击的标题挂上共享名，实现 morph
    if (morphEl) morphEl.style.viewTransitionName = 'post-title';
    document.startViewTransition(function () {
      showView(view, false);
      // 目标侧标题承接同一个名字
      var target = document.querySelector('[data-view="' + view + '"] .morph-target');
      if (target) target.style.viewTransitionName = 'post-title';
    });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-goto]');
    if (!a) return;
    e.preventDefault();
    var view = a.getAttribute('data-goto');
    swap(view, a.hasAttribute('data-morph') ? a : null);
  });

  window.addEventListener('popstate', function () {
    var id = (location.hash || '#home').slice(1);
    showView(id, false);
  });

  // 初始视图
  var initial = (location.hash || '#home').slice(1);
  showView(initial, false);
})();
