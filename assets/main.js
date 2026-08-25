/* 意大利艺术与文明之旅 - 交互脚本：灯箱 / 城市筛选 */
(function () {
  "use strict";

  /* ---------- 灯箱 ---------- */

  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-label", "图片查看器");
  lb.innerHTML =
    '<button class="lightbox__close" aria-label="关闭">×</button>' +
    '<button class="lightbox__prev" aria-label="上一张">‹</button>' +
    '<img src="" alt="">' +
    '<button class="lightbox__next" aria-label="下一张">›</button>' +
    '<p class="lightbox__cap"></p>';
  document.body.appendChild(lb);

  var lbImg = lb.querySelector("img");
  var lbCap = lb.querySelector(".lightbox__cap");
  var current = -1;
  var items = [];

  function collect() {
    items = Array.prototype.slice.call(
      document.querySelectorAll(".exhibit__img img")
    );
  }

  function show(idx) {
    if (!items.length) return;
    current = (idx + items.length) % items.length;
    var img = items[current];
    lbImg.src = img.getAttribute("src");
    lbImg.alt = img.getAttribute("alt") || "";
    var fig = img.closest("figure");
    var cap = "";
    if (fig) {
      var h = fig.querySelector("h4");
      var meta = fig.querySelector(".exhibit__meta");
      if (h) cap += h.textContent;
      if (meta) cap += (cap ? " · " : "") + meta.textContent;
    }
    lbCap.textContent = cap;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function hide() {
    lb.classList.remove("open");
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (e) {
    var target = e.target;
    if (target.closest && target.closest(".lightbox__close")) { hide(); return; }
    if (target === lb) { hide(); return; }
    var img = target.closest && target.closest(".exhibit__img img");
    if (img) {
      collect();
      show(items.indexOf(img));
      return;
    }
    if (target.closest && target.closest(".lightbox__prev")) { show(current - 1); return; }
    if (target.closest && target.closest(".lightbox__next")) { show(current + 1); }
  });

  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") hide();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  /* ---------- 城市页类型筛选 ---------- */

  var filter = document.querySelector(".filter");
  if (filter) {
    var cards = document.querySelectorAll(".card-grid .card");
    filter.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      filter.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      var f = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var ok = f === "all" || card.getAttribute("data-kind") === f;
        card.style.display = ok ? "" : "none";
      });
    });
  }
})();
