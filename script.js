"use strict";

/**
 * Portfolio — Izan Ruzafa
 * Interacciones de la interfaz: tema, animaciones de entrada,
 * navegación activa, contadores y efectos sutiles.
 * Todo el código respeta `prefers-reduced-motion` y degrada con seguridad.
 */
(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ *
   * Año dinámico en el footer
   * ------------------------------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------ *
   * Tema claro/oscuro (persistente en localStorage)
   * ------------------------------------------------------------------ */
  const themeToggle = document.getElementById("themeToggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  const activeTheme = () =>
    root.getAttribute("data-theme") || (prefersDark.matches ? "dark" : "light");

  const syncToggle = () => {
    if (themeToggle) themeToggle.setAttribute("aria-pressed", String(activeTheme() === "dark"));
  };

  if (themeToggle) {
    syncToggle();
    themeToggle.addEventListener("click", () => {
      const next = activeTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* almacenamiento no disponible: el tema solo dura la sesión */
      }
      syncToggle();
    });
  }

  /* ------------------------------------------------------------------ *
   * Animaciones de entrada al hacer scroll (cards y secciones)
   * ------------------------------------------------------------------ */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("scroll-reveal");
    revealObserver.observe(section);
  });

  /* Animación inicial del billboard */
  const billboard = document.querySelector(".billboard");
  if (billboard && !reduceMotion) {
    billboard.style.opacity = "0";
    billboard.style.transform = "translateY(20px)";
    setTimeout(() => {
      billboard.style.transition = "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      billboard.style.opacity = "1";
      billboard.style.transform = "translateY(0)";
    }, 100);
  }

  /* ------------------------------------------------------------------ *
   * Navegación: resaltar la sección visible (IntersectionObserver)
   * ------------------------------------------------------------------ */
  const navLinks = Array.from(document.querySelectorAll('.topnav .links a[href^="#"]'));
  if (navLinks.length) {
    const linkBySection = new Map(
      navLinks.map((link) => [link.getAttribute("href").slice(1), link])
    );

    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkBySection.get(entry.target.id);
          if (link && entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    document.querySelectorAll("section[id]").forEach((s) => activeObserver.observe(s));
  }

  /* ------------------------------------------------------------------ *
   * Scroll: ocultar el header al bajar y botón "volver arriba".
   * Un único listener, limitado con requestAnimationFrame.
   * ------------------------------------------------------------------ */
  const header = document.querySelector(".site-header");
  const backToTop = document.getElementById("backToTop");
  let lastScroll = window.pageYOffset;
  let ticking = false;

  const onScroll = () => {
    const y = window.pageYOffset;
    if (header) {
      header.style.transform = y > lastScroll && y > 100 ? "translateY(-100%)" : "translateY(0)";
    }
    if (backToTop) backToTop.classList.toggle("visible", y > 300);
    lastScroll = y;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------------ *
   * Contadores de las estadísticas (animados al entrar en viewport)
   * ------------------------------------------------------------------ */
  const animateCounter = (el, target, suffix) => {
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statsSection = document.querySelector(".stats");
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll(".stat-number").forEach((num) => {
            const raw = num.textContent.trim();
            const target = parseInt(raw, 10) || 0;
            const suffix = raw.replace(/[\d\s]/g, ""); // conserva sufijos como "+"
            animateCounter(num, target, suffix);
          });
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  /* ------------------------------------------------------------------ *
   * Buscador de proyectos: filtra las tarjetas en vivo (estilo Netflix)
   * ------------------------------------------------------------------ */
  const projectSearch = document.getElementById("projectSearch");
  if (projectSearch) {
    const cards = Array.from(document.querySelectorAll(".nf-card"));
    const rows = Array.from(document.querySelectorAll("[data-row]"));
    const noResults = document.querySelector(".nf-noresults");
    const queryOut = document.getElementById("nfQuery");

    const applyFilter = () => {
      const q = projectSearch.value.trim().toLowerCase();
      cards.forEach((card) => {
        const haystack = (card.dataset.search || card.textContent).toLowerCase();
        card.classList.toggle("is-hidden", q !== "" && !haystack.includes(q));
      });
      let anyVisible = false;
      rows.forEach((row) => {
        const visible = row.querySelector(".nf-card:not(.is-hidden)") !== null;
        row.classList.toggle("is-hidden", !visible);
        if (visible) anyVisible = true;
      });
      if (noResults) {
        noResults.hidden = anyVisible || q === "";
        if (queryOut) queryOut.textContent = projectSearch.value.trim();
      }
    };

    projectSearch.addEventListener("input", applyFilter);
  }

  /* ------------------------------------------------------------------ *
   * Filas horizontales: desplazamiento con flechas + estado de los botones
   * ------------------------------------------------------------------ */
  document.querySelectorAll(".nf-row-scroller").forEach((scroller) => {
    const track = scroller.querySelector(".nf-track");
    const prev = scroller.querySelector(".nf-prev");
    const next = scroller.querySelector(".nf-next");
    if (!track) return;

    const step = () => Math.max(track.clientWidth * 0.85, 280);
    const updateArrows = () => {
      const maxScroll = track.scrollWidth - track.clientWidth - 4;
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= maxScroll;
    };

    const behavior = reduceMotion ? "auto" : "smooth";
    if (prev) prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior }));
    if (next) next.addEventListener("click", () => track.scrollBy({ left: step(), behavior }));

    let rowTicking = false;
    track.addEventListener(
      "scroll",
      () => {
        if (!rowTicking) {
          window.requestAnimationFrame(() => {
            updateArrows();
            rowTicking = false;
          });
          rowTicking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", updateArrows, { passive: true });
    updateArrows();
  });

})();
