// Año dinámico en el footer
document.getElementById("year").textContent = new Date().getFullYear();

// Toggle de tema claro/oscuro (recuerda la elección en localStorage)
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const root = document.documentElement;
    const current =
      root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });
}

// Scroll reveal animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observar todos los elementos que queremos animar
document.addEventListener('DOMContentLoaded', () => {
  // Animar las cards de proyectos
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.classList.add('scroll-reveal');
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
  });

  // Animar secciones
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.add('scroll-reveal');
    observer.observe(section);
  });

  // Animación inicial del hero
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(20px)';
    setTimeout(() => {
      hero.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      hero.style.opacity = '1';
      hero.style.transform = 'translateY(0)';
    }, 100);
  }
});

// Efecto parallax suave en el header
let lastScroll = 0;
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll && currentScroll > 100) {
    // Scrolling down
    header.style.transform = 'translateY(-100%)';
  } else {
    // Scrolling up
    header.style.transform = 'translateY(0)';
  }

  lastScroll = currentScroll;
});

// Smooth scroll para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Efecto hover en los placeholders de demo
const demoPlaceholders = document.querySelectorAll('.demo-placeholder');
demoPlaceholders.forEach(placeholder => {
  placeholder.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.02)';
  });

  placeholder.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
});

// Prevenir click en botones deshabilitados
document.querySelectorAll('.btn.disabled').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
  });
});

// Active section highlighting en navegación
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.topnav .links a[href^="#"]');

function highlightActiveSection() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightActiveSection);
document.addEventListener('DOMContentLoaded', highlightActiveSection);

// Counter animation para las estadísticas
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + (element.textContent.includes('+') ? '+' : '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
    }
  }, 30);
}

// Observer para animar contadores cuando aparecen
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.stat-number');
      numbers.forEach(number => {
        const text = number.textContent;
        const value = parseInt(text);
        number.textContent = '0';
        setTimeout(() => animateCounter(number, value), 200);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// Back to top button
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

window.addEventListener('scroll', toggleBackToTop);

// Efecto parallax sutil en las cards de proyectos
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 30;
    const rotateY = (centerX - x) / 30;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});