/* ==========================================================================
   地火创客 · 站点脚本
   无依赖。负责：导航、滚动动画、动态/项目渲染与筛选、首屏火星。
   ========================================================================== */

(function () {
  "use strict";

  var data = window.DIHUO_DATA || { news: [], projects: [] };
  var site = window.DIHUO_SITE || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = /^en/i.test(document.documentElement.lang || "") ? "en" : "zh";

  var UI = {
    zh: {
      menuOpen: "打开菜单",
      menuClose: "关闭菜单",
      newsFallback: "动态",
      readMore: "阅读更多",
      view: "查看",
      newsEmpty: "暂时没有动态，火还在下面烧着。",
      projectEmpty: "暂时没有开放项目，欢迎直接带着想法来。",
      filter: "Filter",
      all: "全部",
      newsCount: function (n) {
        return n + " 条";
      },
      projectCount: function (n) {
        return n + " 个方向";
      },
      need: "需要",
      offer: "可以提供",
      joinProject: "我想参与",
      issueTitle: "[参与] ",
      issueBody: function (title) {
        return (
          "你好，我想参与「" +
          title +
          "」。\n\n我能提供的：\n\n我想了解的：\n\n（可以附上 GitHub 主页、作品或联系方式）\n"
        );
      }
    },
    en: {
      menuOpen: "Open menu",
      menuClose: "Close menu",
      newsFallback: "Log",
      readMore: "Read more",
      view: "View",
      newsEmpty: "No updates yet. The fire is still burning below.",
      projectEmpty: "No open projects right now. Bring an idea and say hello.",
      filter: "Filter",
      all: "All",
      newsCount: function (n) {
        return n + (n === 1 ? " entry" : " entries");
      },
      projectCount: function (n) {
        return n + (n === 1 ? " project" : " projects");
      },
      need: "Need",
      offer: "Can offer",
      joinProject: "I'm interested",
      issueTitle: "[Join] ",
      issueBody: function (title) {
        return (
          'Hi, I would like to get involved in "' +
          title +
          '".\n\nWhat I can offer:\n\nWhat I would like to know:\n\n(GitHub profile, portfolio or contact details welcome)\n'
        );
      }
    }
  }[lang];

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };
  var $$ = function (selector, scope) {
    return Array.prototype.slice.call(
      (scope || document).querySelectorAll(selector)
    );
  };

  var ESC = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return ESC[c];
    });
  }

  function fmtDate(date) {
    return esc(String(date || "").replace(/-/g, "."));
  }

  function issueLink(title, body) {
    var base = site.issueNew || "https://github.com/dihuolab/weblog/issues/new";
    return (
      base +
      "?title=" +
      encodeURIComponent(title) +
      "&body=" +
      encodeURIComponent(body)
    );
  }

  /* ------------------------------ 年份 ------------------------------ */
  $$("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------ 页头 ------------------------------ */
  var header = $("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var toggle = $(".menu-toggle");
  var nav = $("#site-nav");

  function closeNav() {
    document.body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (toggle) toggle.setAttribute("aria-label", UI.menuOpen);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? UI.menuClose : UI.menuOpen);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* --------------------------- 进场动画 --------------------------- */
  var observer = null;

  function observeReveal(scope) {
    var els = $$(".reveal:not(.is-in)", scope || document);
    if (!els.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    if (!observer) {
      observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.04 }
      );
    }

    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------ 动态 ------------------------------ */
  function newsCard(item) {
    var type = item.type || UI.newsFallback;
    var link = item.link
      ? '<a class="text-link" href="' +
        esc(item.link) +
        '">' +
        esc(UI.readMore) +
        ' <span aria-hidden="true">→</span></a>'
      : "";

    return (
      '<article class="news-card reveal" data-type="' +
      esc(type) +
      '">' +
      '<div class="news-meta"><time datetime="' +
      esc(item.date) +
      '">' +
      fmtDate(item.date) +
      '</time><span class="news-tag">' +
      esc(type) +
      "</span></div>" +
      "<h3>" +
      esc(item.title) +
      "</h3>" +
      "<p>" +
      esc(item.summary) +
      "</p>" +
      link +
      "</article>"
    );
  }

  function logItem(item) {
    var type = item.type || UI.newsFallback;
    var link = item.link
      ? '<a class="text-link" href="' +
        esc(item.link) +
        '">' +
        esc(UI.view) +
        ' <span aria-hidden="true">→</span></a>'
      : "";

    return (
      '<article class="log-item reveal" data-type="' +
      esc(type) +
      '">' +
      '<div class="log-date"><time datetime="' +
      esc(item.date) +
      '">' +
      fmtDate(item.date) +
      '</time><span>' +
      esc(type) +
      "</span></div>" +
      '<div class="log-body"><h3>' +
      esc(item.title) +
      "</h3><p>" +
      esc(item.summary) +
      "</p>" +
      link +
      "</div></article>"
    );
  }

  function setupNews() {
    var root = $("[data-news-list]");
    if (!root) return;

    var limit = parseInt(root.dataset.limit || "0", 10) || 0;
    var isLog = root.classList.contains("log");
    var countEl = $("[data-result-count]");
    var items = (data.news || []).slice().sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    });
    var shown = limit > 0 ? items.slice(0, limit) : items;

    root.innerHTML = shown.length
      ? shown
          .map(function (item) {
            return isLog ? logItem(item) : newsCard(item);
          })
          .join("")
      : '<p class="empty">' + esc(UI.newsEmpty) + "</p>";

    if (countEl) countEl.textContent = UI.newsCount(shown.length);

    var filterRoot = $("[data-news-filters]");
    if (filterRoot && !limit) {
      var types = [];
      items.forEach(function (item) {
        var t = item.type || UI.newsFallback;
        if (types.indexOf(t) === -1) types.push(t);
      });

      var labels = [UI.all].concat(types);
      filterRoot.innerHTML =
        '<span class="filter-label">' + esc(UI.filter) + "</span>" +
        labels
          .map(function (label, index) {
            return (
              '<button class="chip" type="button" aria-pressed="' +
              (index === 0) +
              '" data-filter="' +
              esc(label === UI.all ? "" : label) +
              '">' +
              esc(label) +
              "</button>"
            );
          })
          .join("");

      filterRoot.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-filter]");
        if (!btn) return;

        $$(".chip", filterRoot).forEach(function (chip) {
          chip.setAttribute("aria-pressed", String(chip === btn));
        });

        var filter = btn.dataset.filter;
        var count = 0;

        $$("[data-news-list] > [data-type]", root).forEach(function (card) {
          var show = !filter || card.dataset.type === filter;
          card.hidden = !show;
          if (show) count += 1;
        });

        if (countEl) countEl.textContent = UI.newsCount(count);
      });
    }
  }

  /* ------------------------------ 项目 ------------------------------ */
  var STATUS_CLASS = {
    招募中: "is-open",
    进行中: "is-active",
    筹备中: "is-prep",
    已完成: "is-done",
    Recruiting: "is-open",
    "In progress": "is-active",
    Preparing: "is-prep",
    Completed: "is-done"
  };

  function projectCard(project, index) {
    var statusClass =
      STATUS_CLASS[project.status] || "is-prep";
    var tags = (project.tags || [])
      .map(function (tag) {
        return '<span class="tag">' + esc(tag) + "</span>";
      })
      .join("");

    function list(arr) {
      return (arr || [])
        .map(function (item) {
          return "<li>" + esc(item) + "</li>";
        })
        .join("");
    }

    var body = UI.issueBody(project.title);
    var link = issueLink(UI.issueTitle + project.title, body);
    var note = project.note
      ? '<p class="project-note">' + esc(project.note) + "</p>"
      : "";

    return (
      '<article class="project-card reveal" data-tags="' +
      esc((project.tags || []).join("|")) +
      '">' +
      '<div class="project-top"><span class="status ' +
      statusClass +
      '">' +
      esc(project.status) +
      '</span><span class="project-id mono">PRJ-' +
      String(index + 1).padStart(2, "0") +
      "</span></div>" +
      "<h3>" +
      esc(project.title) +
      "</h3>" +
      '<p class="project-summary">' +
      esc(project.summary) +
      "</p>" +
      '<div class="tags">' +
      tags +
      "</div>" +
      '<div class="spec"><div><h4>' +
      esc(UI.need) +
      "</h4><ul>" +
      list(project.need) +
      "</ul></div><div><h4>" +
      esc(UI.offer) +
      "</h4><ul>" +
      list(project.offer) +
      "</ul></div></div>" +
      note +
      '<div class="project-foot"><a class="text-link" href="' +
      link +
      '" target="_blank" rel="noopener">' +
      esc(UI.joinProject) +
      ' <span aria-hidden="true">↗</span></a>' +
      '<span class="mono">OPEN CALL</span></div>' +
      "</article>"
    );
  }

  function setupProjects() {
    var root = $("[data-project-list]");
    if (!root) return;

    var limit = parseInt(root.dataset.limit || "0", 10) || 0;
    var all = data.projects || [];
    var shown = limit > 0 ? all.slice(0, limit) : all;
    var countEl = $("[data-result-count]");

    root.innerHTML = shown.length
      ? shown
          .map(function (project) {
            return projectCard(project, all.indexOf(project));
          })
          .join("")
      : '<p class="empty">' + esc(UI.projectEmpty) + "</p>";

    if (countEl) countEl.textContent = UI.projectCount(shown.length);

    var filterRoot = $("[data-project-filters]");
    if (filterRoot && !limit) {
      var tags = [];
      all.forEach(function (project) {
        (project.tags || []).forEach(function (tag) {
          if (tags.indexOf(tag) === -1) tags.push(tag);
        });
      });

      var labels = [UI.all].concat(tags);
      filterRoot.innerHTML =
        '<span class="filter-label">' + esc(UI.filter) + "</span>" +
        labels
          .map(function (label, index) {
            return (
              '<button class="chip" type="button" aria-pressed="' +
              (index === 0) +
              '" data-filter="' +
              esc(label === UI.all ? "" : label) +
              '">' +
              esc(label) +
              "</button>"
            );
          })
          .join("");

      filterRoot.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-filter]");
        if (!btn) return;

        $$(".chip", filterRoot).forEach(function (chip) {
          chip.setAttribute("aria-pressed", String(chip === btn));
        });

        var filter = btn.dataset.filter;
        var count = 0;

        $$(".project-card", root).forEach(function (card) {
          var cardTags = (card.dataset.tags || "").split("|");
          var show = !filter || cardTags.indexOf(filter) !== -1;
          card.hidden = !show;
          if (show) count += 1;
        });

        if (countEl) countEl.textContent = UI.projectCount(count);
      });
    }
  }

  /* --------------------------- 首屏火星 --------------------------- */
  function initEmbers() {
    var canvas = $("[data-embers]");
    if (!canvas || reduceMotion) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var width = 0;
    var height = 0;
    var dpr = 1;
    var particles = [];
    var raf = 0;
    var last = 0;
    var visible = true;
    var MAX = 70;
    var COLORS = [
      [232, 35, 47],
      [255, 92, 54],
      [255, 170, 120]
    ];

    function resize() {
      var rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (!width || !height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      return {
        x: Math.random() * width,
        y: height + Math.random() * 30,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -(0.35 + Math.random() * 0.95),
        r: 0.5 + Math.random() * 1.6,
        life: 0,
        ttl: 220 + Math.random() * 320,
        c: COLORS[(Math.random() * COLORS.length) | 0]
      };
    }

    function frame(now) {
      raf = 0;
      if (!visible || !width || !height) return;

      if (!last) last = now;
      var dt = Math.min(now - last, 48);
      last = now;

      ctx.clearRect(0, 0, width, height);

      if (particles.length < MAX) {
        var n = Math.random() < 0.55 ? 2 : 1;
        for (var i = 0; i < n && particles.length < MAX; i += 1) {
          particles.push(spawn());
        }
      }

      ctx.globalCompositeOperation = "lighter";

      particles = particles.filter(function (p) {
        return p.life < p.ttl;
      });

      for (var j = 0; j < particles.length; j += 1) {
        var p = particles[j];
        p.life += dt;
        var t = Math.min(p.life / p.ttl, 1);
        var alpha = Math.sin(t * Math.PI) * 0.55;
        p.x +=
          p.vx * (dt / 16.7) + Math.sin(p.life * 0.0012 + p.y * 0.01) * 0.12;
        p.y += p.vy * (dt / 16.7);

        ctx.beginPath();
        ctx.fillStyle =
          "rgba(" + p.c[0] + "," + p.c[1] + "," + p.c[2] + "," + alpha.toFixed(3) + ")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = window.requestAnimationFrame(frame);
    }

    function start() {
      if (!raf) {
        last = 0;
        raf = window.requestAnimationFrame(frame);
      }
    }

    function stop() {
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    resize();
    start();

    window.addEventListener(
      "resize",
      function () {
        resize();
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (visible) start();
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          visible = entries[0].isIntersecting;
          if (visible && !document.hidden) start();
          else stop();
        },
        { threshold: 0 }
      ).observe(canvas);
    }
  }

  /* ---------------------------- 初始化 ---------------------------- */
  setupNews();
  setupProjects();
  observeReveal();
  initEmbers();
})();
