/* ==========================================================================
   DIHUOLAB · Workshop library and manual behaviour
   - renders the workshop index from assets/js/data-workshops.js
   - builds the table of contents and scrollspy on manual pages
   - persists checklist state in localStorage
   - print button and on-site focus mode
   ========================================================================== */

(function () {
  "use strict";

  var lang = /^en/i.test(document.documentElement.lang || "") ? "en" : "zh";
  var UI = {
    zh: {
      count: function (n) {
        return n + " 份手册";
      },
      duration: "时长",
      people: "人数",
      level: "难度",
      open: "打开手册",
      published: "已发布",
      draft: "草稿",
      toc: "本页目录",
      focusOn: "现场模式",
      focusOff: "退出现场模式",
      template: "模板"
    },
    en: {
      count: function (n) {
        return n + (n === 1 ? " manual" : " manuals");
      },
      duration: "Length",
      people: "Group",
      level: "Level",
      open: "Open manual",
      published: "Published",
      draft: "Draft",
      toc: "On this page",
      focusOn: "On-site mode",
      focusOff: "Exit on-site mode",
      template: "Template"
    }
  }[lang];

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

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call(
      (scope || document).querySelectorAll(selector)
    );
  }

  /* --------------------------- Workshop index --------------------------- */

  function fact(label, value) {
    if (!value) return "";
    return (
      '<div><span>' +
      esc(label) +
      "</span><strong>" +
      esc(value) +
      "</strong></div>"
    );
  }

  function workshopCard(workshop, index) {
    var copy = workshop[lang] || workshop.zh || workshop.en || {};
    var title = copy.title || workshop.slug || "";
    var summary = copy.summary || "";
    var href = workshop.href || workshop.slug + ".html";
    var status = workshop.status === "draft" ? UI.draft : UI.published;
    var tags = (copy.tags || [])
      .map(function (tag) {
        return '<span class="workshop-tag">' + esc(tag) + "</span>";
      })
      .join("");

    return (
      '<article class="workshop-card">' +
      '<div class="workshop-card-top"><span class="mono">' +
      String(index + 1).padStart(2, "0") +
      " / MANUAL</span>" +
      '<span class="workshop-status">' +
      esc(status) +
      "</span></div>" +
      '<h3><a href="' +
      esc(href) +
      '">' +
      esc(title) +
      "</a></h3>" +
      "<p>" +
      esc(summary) +
      "</p>" +
      '<div class="workshop-facts">' +
      fact(UI.duration, copy.duration) +
      fact(UI.people, copy.people) +
      fact(UI.level, copy.level) +
      "</div>" +
      (tags ? '<div class="workshop-tags">' + tags + "</div>" : "") +
      '<a class="text-link" href="' +
      esc(href) +
      '">' +
      esc(UI.open) +
      ' <span aria-hidden="true">→</span></a>' +
      "</article>"
    );
  }

  function initWorkshopIndex() {
    var list = $("[data-workshop-list]");
    if (!list) return;

    var data = window.DIHUO_WORKSHOPS || {};
    var workshops = (data.workshops || []).filter(function (workshop) {
      return workshop && workshop.status !== "draft";
    });
    var count = $("[data-workshop-count]");
    var empty = $("[data-workshop-empty]");

    if (count) count.textContent = UI.count(workshops.length);

    if (!workshops.length) {
      if (empty) empty.hidden = false;
      list.innerHTML = "";
      return;
    }

    if (empty) empty.hidden = true;
    list.innerHTML = workshops
      .map(function (workshop, index) {
        return workshopCard(workshop, index);
      })
      .join("");
  }

  /* ------------------------------ Manual TOC ------------------------------ */

  function initToc() {
    var toc = $("[data-toc-list]");
    var content = $(".manual-content");
    if (!toc || !content) return;

    var headings = $$("section[id] > h2", content);
    if (!headings.length) {
      var aside = toc.closest("[data-manual-toc]");
      if (aside) aside.hidden = true;
      return;
    }

    function idOf(heading) {
      return heading.parentElement.id;
    }

    toc.innerHTML = headings
      .map(function (heading) {
        var label = heading.textContent.replace(/^\s*\d+\s*/, "").trim();
        return '<a href="#' + esc(idOf(heading)) + '">' + esc(label) + "</a>";
      })
      .join("");

    var links = $$("a", toc);

    function setActive(id) {
      links.forEach(function (link) {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === "#" + id
        );
      });
    }

    function update() {
      var marker = window.scrollY + 150;
      var current = headings[0];
      headings.forEach(function (heading) {
        if (heading.getBoundingClientRect().top + window.scrollY <= marker) {
          current = heading;
        }
      });
      if (current) setActive(idOf(current));
    }

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          update();
          ticking = false;
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", update);
    update();
  }

  /* ------------------------------- Checklist ------------------------------- */

  function initChecklist() {
    var boxes = $$("[data-check]");
    if (!boxes.length) return;

    var storageKey = "dihuo-workshop:" + location.pathname;
    var progress = $("[data-check-progress]");
    var reset = $("[data-reset-checks]");

    function keyFor(box, index) {
      return storageKey + ":" + (box.id || "check-" + index);
    }

    function updateProgress() {
      if (!progress) return;
      var checked = boxes.filter(function (box) {
        return box.checked;
      }).length;
      progress.textContent = checked + " / " + boxes.length;
    }

    boxes.forEach(function (box, index) {
      var key = keyFor(box, index);
      try {
        if (window.localStorage.getItem(key) === "1") box.checked = true;
      } catch (error) {
        /* localStorage can be unavailable in private/file contexts */
      }
      box.addEventListener("change", function () {
        try {
          window.localStorage.setItem(key, box.checked ? "1" : "0");
        } catch (error) {
          /* ignore */
        }
        updateProgress();
      });
    });

    if (reset) {
      reset.addEventListener("click", function () {
        boxes.forEach(function (box, index) {
          box.checked = false;
          try {
            window.localStorage.removeItem(keyFor(box, index));
          } catch (error) {
            /* ignore */
          }
        });
        updateProgress();
      });
    }

    updateProgress();
  }

  /* ------------------------------- Controls ------------------------------- */

  function initControls() {
    $$("[data-print]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.print();
      });
    });

    var focusToggle = $("[data-focus-toggle]");
    if (focusToggle) {
      focusToggle.addEventListener("click", function () {
        var active = document.body.classList.toggle("manual-focus");
        focusToggle.setAttribute("aria-pressed", String(active));
        focusToggle.textContent = active ? UI.focusOff : UI.focusOn;
      });
    }
  }

  initWorkshopIndex();
  initToc();
  initChecklist();
  initControls();
})();
