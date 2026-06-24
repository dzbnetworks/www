/* DZB Networks — shared interactions */
(function () {
  "use strict";

  // Sticky nav background on scroll
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    var ICON_MENU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18" stroke-linecap="round"/></svg>';
    var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>';

    function setMenu(open) {
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.innerHTML = open ? ICON_CLOSE : ICON_MENU;
    }
    function isOpen() { return links.classList.contains("open"); }

    // Tap the hamburger to open/close
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!isOpen());
    });
    // Close after choosing a link
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    // Close when tapping anywhere outside the menu
    document.addEventListener("click", function (e) {
      if (isOpen() && nav && !nav.contains(e.target)) setMenu(false);
    });
    // Close when the page is scrolled
    window.addEventListener("scroll", function () {
      if (isOpen()) setMenu(false);
    }, { passive: true });
    // Close on Escape, and reset if resized up to desktop
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 920 && isOpen()) setMenu(false);
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // FAQ accordion
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".faq-item");
      var a = item.querySelector(".faq-a");
      var open = item.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : null;
    });
  });

  // Animated counters
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1400, start = performance.now();
        function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  // Contact form (demo handler)
  var form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-status");
      if (note) {
        note.textContent = "Thanks — your message has been queued. We'll reply within one business day.";
        note.style.color = "var(--green)";
      }
      form.reset();
    });
  }

  // Footer year
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* Theme toggle — swap dark/light stylesheet */
(function(){
  var link = document.getElementById("theme-css");
  var btn  = document.getElementById("theme-btn");
  if(!link || !btn) return;
  var SUN  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4.4"/><path d="M12 2v2.6M12 19.4V22M4.6 4.6l1.9 1.9M17.5 17.5l1.9 1.9M2 12h2.6M19.4 12H22M4.6 19.4l1.9-1.9M17.5 6.5l1.9-1.9" stroke-linecap="round"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DARK_CSS = "css/style.css";
  var LIGHT_CSS = "css/style-light.css";
  function isLight(){ return /style-light\.css/.test(link.getAttribute("href")); }
  function render(){
    // when light is active, button offers "Dark mode" (moon); when dark, offers "Light mode" (sun)
    btn.innerHTML = (isLight() ? MOON : SUN) + '<span class="tt-label">' + (isLight() ? "Dark mode" : "Light mode") + '</span>';
    btn.setAttribute("aria-label", isLight() ? "Switch to dark theme" : "Switch to light theme");
  }
  render();
  btn.addEventListener("click", function(){
    var goLight = !isLight();
    link.setAttribute("href", goLight ? LIGHT_CSS : DARK_CSS);
    try{ sessionStorage.setItem("dzb-theme", goLight ? "light" : "dark"); }catch(e){}
    render();
  });
})();
