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

  document.querySelectorAll(".card").forEach((card, index) => {
    card.classList.add("scroll-reveal");
    card.style.transitionDelay = `${index * 0.1}s`;
    revealObserver.observe(card);
  });

  /* Animación inicial del hero */
  const hero = document.querySelector(".hero");
  if (hero && !reduceMotion) {
    hero.style.opacity = "0";
    hero.style.transform = "translateY(20px)";
    setTimeout(() => {
      hero.style.transition = "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      hero.style.opacity = "1";
      hero.style.transform = "translateY(0)";
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
   * Efecto 3D sutil en las tarjetas de proyecto.
   * Solo en dispositivos con puntero fino (ratón) y sin reduced-motion.
   * ------------------------------------------------------------------ */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const rotateX = (e.clientY - rect.top - rect.height / 2) / 30;
        const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 30;
        card.style.transform =
          `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }
})();
